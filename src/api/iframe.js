import * as dataframe from '../core/utils/dataframe';

var config = {};
var fnCallbacks = [];

export const init = async (options, hal9wnd) => {
  fnCallbacks = [];
  hal9wnd = hal9wnd ? hal9wnd : {};

  const html = options.html;
  html.innerHTML = '';

  var iframe = document.createElement("iframe");

  // TODO: Control features based on user warning and preferences
  // iframe.allow = 'camera;microphone';
  // iframe.setAttribute('sandbox', 'allow-forms allow-downloads allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-scripts allow-same-origin');

  iframe.setAttribute('scrolling', 'no');

  iframe.style.border = 'none';
  iframe.style.width = '100%';
  iframe.style.height = '100%';

  var secret = Math.random();
  const iframehtml = `
    <!DOCTYPE html>
    <html style="height: 100%">
      <head>
        <base target="_blank">
        <script src='${options.api}'></script>
        <script>
          // mock localstorage for iframes to avoid errors
          const localStorageMock = (() => {
            let store = {};
            return {
              getItem(key) {
                return store[key] || null;
              },
              setItem(key, value) {
                store[key] = value.toString();
              },
              removeItem(key) {
                delete store[key];
              },
              clear() {
                store = {};
              }
            };
          })();
          Object.defineProperty(window, 'localStorage', { value: localStorageMock });
          window.localStorage.setItem("KEY", "INPUT")
        </script>
        <script>
          const hal9wnd = JSON.parse('${JSON.stringify(hal9wnd)}');
          window.hal9 = Object.assign(hal9wnd, window.hal9);

          var postID = -1;
          function enableDebug(config) {
            window.hal9cfg = { debug: config };
          }

          function breakIfDebug() {
            if (typeof(window) != 'undefined' && window.hal9cfg && window.hal9cfg.debug && window.hal9cfg.debug.iframe) {
              debugger;
            }
          }

          async function runAsync(body, params) {
            breakIfDebug()

            var block = new Function("params", "return (async (params) => { " + "return " + body + "})")();
            return await block(params);
          };

          function postError(id, message, url, line) {
            window.parent.postMessage({ secret: ${secret}, id: id, error: message + ' (' + url + ' ' + line + ')' }, '*');
          }

          window.onerror = function (message, url, line) {
            breakIfDebug()
            postError(postID, message, url, line);
          }

          window.addEventListener('message', event => {
            if (!event.data || event.data.secret != ${secret}) return;

            const deserializeFunction = (target) => {
              if (typeof(target) == 'object' && target) {
                Object.keys(target).forEach(key => {
                  if (typeof(target[key]) === 'string' && target[key].startsWith('___hal9___function___callback___')) {
                    const callbackid = parseInt(target[key].replace('___hal9___function___callback___', ''));
                    target[key] = function () {
                      window.parent.postMessage({ secret: ${secret}, id: event.data.id, callbackid: callbackid, params: JSON.parse(JSON.stringify(arguments)) }, '*');
                    };
                  }
                  else {
                    deserializeFunction(target[key]);
                  }
                })
              }
            }
            deserializeFunction(event.data.params);

            (async function() {
              try {
                postID = event.data.id;
              	const result = await runAsync(event.data.body, event.data.params);

                window.parent.postMessage({ secret: ${secret}, id: event.data.id, result: result, html: document.body.innerText.length > 0 }, '*');
              }
              catch(e) {
                breakIfDebug()
                postError(event.data.id, e && e.message ? e.message : e);
              }
            })();
          }); 
        </script>
        <style>
          body {
            height: 100%;
            margin: 0;
            font-family: Helvetica, sans-serif;
            color: #4a4a4a;
            line-height: 1.25;
            font-weight: 200;
          }
          h1, h2 {
            font-weight: 400;
          }
        </style>
      </head>
      <body>
        <div id="output" style="position: relative; width: 100%; height: 100%; overflow: auto;"></div>
      </body>
    </html>
  `;

  iframe.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(iframehtml);

  var waitLoad = new Promise((accept, reject) => {
    iframe.addEventListener('load', accept);
    iframe.addEventListener('error', reject);
  });

  html.appendChild(iframe);
  await waitLoad;

  config = {
    iframe: iframe,
    secret: secret,
    postId: 0
  };
}

const post = async (code, params, options = {}) => {
  try {
    if (typeof(window) != 'undefined' && window.hal9 && window.hal9.debug) {
      const config = window.hal9.debug;
      window.hal9.debug = undefined;
      await post("enableDebug(" + JSON.stringify(config) + ")", []);
    }

    const secret = config.secret;
    const iframe = config.iframe;
    const postId = config.postId++;

    var onResult = null;
    var waitResponse = new Promise((accept, reject) => {
      onResult = function(event) {
        if (!event.data || event.data.secret != secret || event.data.id != postId) return;

        if (event.data.callbackid !== undefined) {
          fnCallbacks[event.data.callbackid](...Object.values(event.data.params));
          return;
        }

        if (!options.longlisten) window.removeEventListener('message', onResult);

        if (event.data.error) {
          reject(event.data.error);
          return;
        }

        accept(event.data.result);
      };

      var responseListener = window.addEventListener('message', onResult);
    });

    if (options.longlisten) {
      var observer = new MutationObserver(function (e) {
        if (e.filter(e => e.removedNodes && e.removedNodes[0] == iframe).length > 0) {
          if (onResult) window.removeEventListener('message', onResult);
        }
      });
      observer.observe(iframe.parentNode, { childList: true });
    }

    // handle callbacks with custom serializer
    const serializeFunctions = (target) => {
      if (typeof(target) == 'object' && target) {
        Object.keys(target).forEach(key => {
          if (typeof(target[key]) === 'function') {
            fnCallbacks.push(target[key]);
            target[key] = '___hal9___function___callback___' + (fnCallbacks.length - 1);
          }
          else {
            serializeFunctions(target[key]);
          }
        })
      }
    }
    serializeFunctions(params);

    iframe.contentWindow.postMessage({ secret: secret, id: postId, body: code, params: params }, '*');
    var result = await waitResponse;

    // data frames can loose their prototype functions when crossing the iframe boundary
    if (typeof(result) == 'object') {
      for (const key of Object.keys(result)) {
        if (dataframe.isDataFrame(result[key])) {
          result[key] = await dataframe.ensure(result[key]);
        }
      }
    }

    return result;
  }
  catch(e) {
    console.log('Hal9 iFrame Error: ' + e + '. Call: ' + code);
    throw e;
  }
}

export const create = async (pipelineid, context) => {
  return await post("hal9.create(params.pipelineid, params.context)", {
    pipelineid: pipelineid,
    context: context,
  })
}

export const load = async (raw) => {
  return await post("hal9.load(params.raw)", {
    raw: raw,
  })
}

export const step = async (url, params, output, options) => {
	return await post("hal9.step(params.url, params.params, params.output, params.options)", {
    url: url,
    params: params,
    output: output,
    options: options
  })
}

export const run = async (pipeline, context) => {
	return await post("hal9.run(params.pipeline, params.context)", {
    pipeline: pipeline,
    context: context,
  }, {
    longlisten: true
  })
}

export const runPipeline = async (pipelineid, context) => {
  return await post("hal9.runPipeline(params.pipelineid, params.context)", {
    pipelineid: pipelineid,
    context: context,
  }, {
    longlisten: true
  })
}

export async function setEnv(env) {
  return await post("hal9.environment.setEnv(params.env)", {
    env: env,
  });
}

export async function datasetsSave(dataurl) {
  return await post("hal9.datasets.save(params.dataurl)", {
    dataurl: dataurl,
  })
}

export async function exporttoGetSaveText(pipelineid, padding, alsoSkip) {
  return await post("hal9.exportto.getSaveText(params.pipelineid, params.padding, params.alsoSkip)", {
    pipelineid: pipelineid,
    padding: padding,
    alsoSkip: alsoSkip,
  })
}

export async function exporttoGetHtml(pipelineid) {
  return await post("hal9.exportto.getHtml(params.pipelineid)", {
    pipelineid: pipelineid,
  })
}

export async function exporttoGetHtmlRemote(pipelinepath) {
  return await post("hal9.exporto.getHtmlRemote(params.pipelinepath)", {
    pipelinepath: pipelinepath,
  })
}

export async function exporttoGetPythonScript(pipelineid) {
  return await post("hal9.exportto.getPythonScript(params.pipelineid)", {
    pipelineid: pipelineid,
  })
}

export async function exporttoGetRScript(pipelineid) {
  return await post("hal9.exportto.getRScript(params.pipelineid)", {
    pipelineid: pipelineid,
  })
}

export async function pipelinesCreate(steps) {
  return await post("hal9.pipelines.create(params.steps)", {
    steps: steps,
  })
}

export async function pipelinesUpdate(pipelineid, steps) {
  return await post("hal9.pipelines.update(params.pipelineid, params.steps)", {
    pipelineid: pipelineid,
    steps: steps,
  })
}

export async function pipelinesRemove(pipelineid) {
  return await post("hal9.pipelines.remove(params.pipelineid)", {
    pipelineid: pipelineid,
  })
}

export async function pipelinesRunStep(pipelineid, sid, context, partial) {
  return await post("hal9.pipelines.runStep(params.pipelineid, params.sid, params.context, params.partial)", {
    pipelineid: pipelineid,
    sid: sid,
    context: context,
    partial: partial,
  })
}

export async function pipelinesRun(pipelineid, context, partial, stepstopid) {
  return await post("hal9.pipelines.run(params.pipelineid, params.context, params.partial, params.stepstopid)", {
    pipelineid: pipelineid,
    context: context,
    partial: partial,
    stepstopid: stepstopid,
  }, {
    longlisten: true
  })
}

export async function pipelinesGetError(pipelineid) {
  return await post("hal9.pipelines.getError(params.pipelineid)", {
    pipelineid: pipelineid,
  })
}

export async function pipelinesGetParams(pipelineid, sid) {
  return await post("hal9.pipelines.getParams(params.pipelineid, params.sid)", {
    pipelineid: pipelineid,
    sid: sid,
  })
}

export async function pipelinesSetParams(pipelineid, sid, params) {
  return await post("hal9.pipelines.setParams(params.pipelineid, params.sid, params.params)", {
    pipelineid: pipelineid,
    sid: sid,
    params: params,
  })
}

export async function pipelinesMergeParams(pipelineid, sid, params) {
  return await post("hal9.pipelines.mergeParams(params.pipelineid, params.sid, params.params)", {
    pipelineid: pipelineid,
    sid: sid,
    params: params,
  })
}

export async function pipelinesGetSteps(pipelineid) {
  return await post("hal9.pipelines.getSteps(params.pipelineid)", {
    pipelineid: pipelineid,
  })
}

export async function pipelinesUpdateStep(pipelineid, step) {
  return await post("hal9.pipelines.updateStep(params.pipelineid, params.step)", {
    pipelineid: pipelineid,
    step: step,
  })
}

export async function pipelinesAddStep(pipelineid, step) {
  return await post("hal9.pipelines.addStep(params.pipelineid, params.step)", {
    pipelineid: pipelineid,
    step: step,
  })
}

export async function pipelinesRemoveStep(pipelineid, step) {
  return await post("hal9.pipelines.removeStep(params.pipelineid, params.step)", {
    pipelineid: pipelineid,
    step: step,
  })
}

export async function pipelinesMoveStep(pipelineid, stepid, change) {
  return await post("hal9.pipelines.moveStep(params.pipelineid, params.stepid, params.change)", {
    pipelineid: pipelineid,
    stepid: stepid,
    change: change,
  })
}

export async function pipelinesGetNested(pipelineid) {
  return await post("hal9.pipelines.getNested(params.pipelineid)", {
    pipelineid: pipelineid,
  })
}

export async function pipelinesGetStep(pipelineid, sid) {
  return await post("hal9.pipelines.getStep(params.pipelineid, params.sid)", {
    pipelineid: pipelineid,
    sid: sid,
  })
}

export async function pipelinesGetRebindablesForStep(pipelineid, step) {
  return await post("hal9.pipelines.getRebindablesForStep(params.pipelineid, params.step)", {
    pipelineid: pipelineid,
    step: step,
  })
}

export async function pipelinesGetSources(pipelineid, sid) {
  return await post("hal9.pipelines.getSources(params.pipelineid, params.sid)", {
    pipelineid: pipelineid,
    sid: sid,
  })
}

export async function pipelinesGetStepError(pipelineid, sid) {
  return await post("hal9.pipelines.getStepError(params.pipelineid, params.sid)", {
    pipelineid: pipelineid,
    sid: sid,
  })
}

export async function pipelinesSetScript(pipelineid, sid, script) {
  return await post("hal9.pipelines.setScript(params.pipelineid, params.sid, params.script)", {
    pipelineid: pipelineid,
    sid: sid,
    script: script,
  })
}

export async function pipelinesGetScript(pipelineid, sid) {
  return await post("hal9.pipelines.getScript(params.pipelineid, params.sid)", {
    pipelineid: pipelineid,
    sid: sid,
  })
}

export async function pipelinesGetHashable(pipelineid) {
  return await post("hal9.pipelines.getHashable(params.pipelineid)", {
    pipelineid: pipelineid,
  })
}

export async function pipelinesLoad(pipeline) {
  return await post("hal9.pipelines.load(params.pipeline)", {
    pipeline: pipeline,
  })
}

export async function pipelinesGetMaxId(pipelineid) {
  return await post("hal9.pipelines.getMaxId(params.pipelineid)", {
    pipelineid: pipelineid,
  })
}

export async function pipelinesGetGlobal(pipelineid, name) {
  return await post("hal9.pipelines.getGlobal(params.pipelineid, params.name)", {
    pipelineid: pipelineid,
    name: name,
  })
}

export async function pipelinesSetGlobal(pipelineid, name, data) {
  return await post("hal9.pipelines.setGlobal(params.pipelineid, params.name, params.data)", {
    pipelineid: pipelineid,
    name: name,
    data: data,
  })
}

export async function pipelinesGetGlobalNames(pipelineid) {
  return await post("hal9.pipelines.getGlobalNames(params.pipelineid)", {
    pipelineid: pipelineid,
  })
}

export async function pipelinesGetGlobals(pipelineid) {
  return await post("hal9.pipelines.getGlobals(params.pipelineid)", {
    pipelineid: pipelineid,
  })
}

export async function pipelinesInvalidateStep(pipelineid, sid) {
  return await post("hal9.pipelines.invalidateStep(params.pipelineid, params.sid)", {
    pipelineid: pipelineid,
    sid: sid,
  })
}

export async function pipelinesSetMetadataProperty(pipelineid, name, value) {
  return await post("hal9.pipelines.setMetadataProperty(params.pipelineid, params.name, params.value)", {
    pipelineid: pipelineid,
    name: name,
    value: value,
  })
}

export async function pipelinesGetMetadata(pipelineid) {
  return await post("hal9.pipelines.getMetadata(params.pipelineid)", {
    pipelineid: pipelineid,
  })
}

export async function pipelinesSetAppProperty(pipelineid, name, value) {
  return await post("hal9.pipelines.setAppProperty(params.pipelineid, params.name, params.value)", {
    pipelineid: pipelineid,
    name: name,
    value: value,
  })
}

export async function pipelinesGetApp(pipelineid) {
  return await post("hal9.pipelines.getApp(params.pipelineid)", {
    pipelineid: pipelineid,
  })
}

export async function remoteInput() {
  throw 'This API should only be used from third party sites';
}

export async function remoteOutput(result) {
  return 'This API should only be used from third party sites';
}

export async function pipelinesAbort(pipelineid) {
  return await post("hal9.pipelines.abort(params.pipelineid)", {
    pipelineid: pipelineid,
  })
}

export async function pipelinesIsAborted(pipelineid) {
  return await post("hal9.pipelines.isAborted(params.pipelineid)", {
    pipelineid: pipelineid,
  })
}

export async function screenshotCapture(output, options = {}) {
  return await post("hal9.screenshot.capture(params.output, params.options)", {
    output: output,
    options: options
  })
}

export async function screenshotResize(sourceImageData, width, height) {
  return await post("hal9.screenshot.resize(params.sourceImageData, params.width, params.height)", {
    sourceImageData: sourceImageData,
    width: width,
    height: height
  })
}

export function htmloutputSetIframeStyle(name, value) {
  config.iframe.style[name] = value;
}

export async function htmloutputGetScrollWidth() {
  return await post("hal9.htmloutput.getScrollWidth()", {
  })
}

export async function htmloutputGetScrollLeft() {
  return await post("hal9.htmloutput.getScrollLeft()", {
  })
}

export async function htmloutputSetScrollLeft(pixels) {
  return await post("hal9.htmloutput.setScrollLeft(params.pixels)", {
    pixels: pixels
  })
}

export async function htmloutputGetScrollHeight() {
  return await post("hal9.htmloutput.getScrollHeight()", {
  })
}

export async function htmloutputGetScrollTop() {
  return await post("hal9.htmloutput.getScrollTop()", {
  })
}

export async function htmloutputSetScrollTop(pixels) {
  return await post("hal9.htmloutput.setScrollTop(params.pixels)", {
    pixels: pixels
  })
}

export async function layoutRegenerateForDocumentView(pipelineid, removeOldLayout) {
  return await post("hal9.layout.regenerateForDocumentView(params.pipelineid, params.removeOldLayout)", {
    pipelineid: pipelineid,
    removeOldLayout: removeOldLayout,
  })
}

export async function layoutStoreAppStepLayouts(pipelineid) {
  return await post("hal9.layout.storeAppStepLayouts(params.pipelineid)", {
    pipelineid: pipelineid,
  })
}

export async function layoutApplyStepLayoutsToApp(stepLayouts) {
  return await post("hal9.layout.applyStepLayoutsToApp(params.stepLayouts)", {
    stepLayouts: stepLayouts,
  })
}

export async function layoutSetHal9StepOverflowProperty(overflowValue) {
  return await post("hal9.layout.setHal9StepOverflowProperty(params.overflowValue)", {
    overflowValue: overflowValue,
  })
}
