import * as dataframe from '../core/utils/dataframe';

var config = {};
var fnCallbacks = [];

export const init = async (options) => {
  fnCallbacks = [];

  const html = options.html;
  html.innerHTML = '';

  var iframe = document.createElement("iframe");
  iframe.style.border = 'none';
  iframe.style.width = '100%';
  iframe.style.height = '100%';

  var secret = Math.random();
  const iframehtml = `
    <!DOCTYPE html>
    <html style="height: 100%">
      <head>
        <script src='${options.api}'></script>
        <script>
          var postID = -1;
          function enableDebug(config) {
            window.hal9cfg = { debug: config };
          }

          async function runAsync(body, params) {
            if (typeof(window) != 'undefined' && window.hal9cfg && window.hal9cfg.debug && window.hal9cfg.debug.iframe) {
              debugger;
            }

            var block = new Function("params", "return (async (params) => { " + "return " + body + "})")();
            return await block(params);
          };

          function postError(id, message, url, line) {
            window.parent.postMessage({ secret: ${secret}, id: id, error: message + ' (' + url + ' ' + line + ')' }, '*');
          }

          window.onerror = function (message, url, line) {
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
                postError(event.data.id, e.message);
              }
            })();
          }); 
        </script>
      </head>
      <body style="height: 100%">
      	<div id="output" style="width: 100%; height: 100%;"></div>
      </body>
    </html>
  `;

  iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(iframehtml);

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

const post = async (code, params) => {
  try {
    if (typeof(window) != 'undefined' && window.hal9 && window.hal9.debug) {
      const config = window.hal9.debug;
      window.hal9.debug = undefined;
      await post("enableDebug(" + JSON.stringify(config) + ")", []);
    }

    const secret = config.secret;
    const iframe = config.iframe;
    const postId = config.postId++;

    var waitResponse = new Promise((accept, reject) => {
      var onResult = function(e) {
        if (!event.data || event.data.secret != secret || event.data.id != postId) return;

        if (event.data.callbackid !== undefined) {
          fnCallbacks[event.data.callbackid](...Object.values(event.data.params));
          return;
        }

        window.removeEventListener('message', onResult);

        if (event.data.error) {
          reject(event.data.error);
          return;
        }

        accept(event.data.result);
      };

      var responseListener = window.addEventListener('message', onResult);
    });

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
      Object.keys(result).forEach(key => {
        if (dataframe.isDataFrame(result[key])) {
          result[key] = dataframe.ensure(result[key]);
        }
      })
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

export const step = async (url, params, output) => {
	return await post("hal9.step(params.url, params.params, params.output)", {
    url: url,
    params: params,
    output: output
  })
}

export const run = async (pipeline, context) => {
	return await post("hal9.run(params.pipeline, params.context)", {
    pipeline: pipeline,
    context: context,
  })
}

export const runPipeline = async (pipelineid, context) => {
  return await post("hal9.runPipeline(params.pipelineid, params.context)", {
    pipelineid: pipelineid,
    context: context,
  })
}

export async function setEnv(env) {
  return await post("hal9.setEnv(params.env)", {
    env: env,
  });
}

export async function datasetsSave(dataurl) {
  return await post("hal9.datasets.save(params.dataurl)", {
    dataurl: dataurl,
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

export async function pipelinesGetSaveText(pipelineid, padding) {
  return await post("hal9.pipelines.getSaveText(params.pipelineid, params.padding)", {
    pipelineid: pipelineid,
    padding: padding
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

export async function pipelinesGetHtml(pipelineid) {
  return await post("hal9.datasets.getHtml(params.pipelineid)", {
    pipelineid: pipelineid,
  })
}

export async function pipelinesGetHtmlRemote(pipelinepath) {
  return await post("hal9.pipelines.getHtmlRemote(params.pipelinepath)", {
    pipelinepath: pipelinepath,
  })
}

export async function pipelinesUpdateMetadata(pipelineid, metadata) {
  return await post("hal9.pipelines.updateMetadata(params.pipelineid, params.metadata)", {
    pipelineid: pipelineid,
    metadata: metadata,
  })
}

export async function pipelinesGetMetadata(pipelineid) {
  return await post("hal9.pipelines.getMetadata(params.pipelineid)", {
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
