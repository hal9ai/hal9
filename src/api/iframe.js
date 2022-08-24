import * as dataframe from '../core/utils/dataframe';
import { getDesignerLoaderHtml, registerDesignerLoader } from './designer';

import * as native from './native';
import * as environment from '../core/utils/environment';
import * as datasets from '../core/datasets';
import LocalExecutor from '../core/executors/local';
import * as pipelines from '../core/pipelines';
import * as iframe from './iframe';
import * as remote from '../remote/remote';
import * as stepapi from '../core/api';
import components from '../../scripts/components.json';
import clone from '../core/utils/clone';
import functions from '../core/utils/functions';

var fnCallbacks = [];

const post = async (config, code, params, options = {}) => {
  try {
    if (typeof(window) != 'undefined' && window.hal9 && window.hal9.debug) {
      const config = window.hal9.debug;
      window.hal9.debug = undefined;
      await post(config, "enableDebug(" + JSON.stringify(config) + ")", []);
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

function IFrameAPI(options, hal9wnd, config) {
  const me = this;

  me.options = options;
  me.hal9wnd = hal9wnd;
  me.config = config;

  function enhanceContext(context) {
    if (me.options.events) {
      context.events = {
        onStart: me.options.events.onStart,
        onEnd: me.options.events.onEnd,
        onError: me.options.events.onError,
        onChange: me.options.events.onChange,
        onEvent: me.options.events.onEvent,
        onInvalidate: me.options.events.onInvalidate
      }
    }

    if (me.options.manifest) {
      context.manifest = me.options.manifest
    }
  }

  me.init = async (options, hal9wnd) => {
    return await post(me.config, "hal9.init(params.options, params.hal9wnd)", {
      options: options,
      hal9wnd: hal9wnd,
    })
  };

  me.create = async (pipelineid, context) => {
    return await post(me.config, "hal9.create(params.pipelineid, params.context)", {
      pipelineid: pipelineid,
      context: context,
    })
  };

  me.load = async (raw) => {
    return await post(me.config, "hal9.load(params.raw)", {
      raw: raw,
    })
  };

  me.step = async (url, params, output, options) => {
    return await post(me.config, "hal9.step(params.url, params.params, params.output, params.options)", {
      url: url,
      params: params,
      output: output,
      options: options
    })
  };

  me.run = async (pipeline, context) => {
    enhanceContext(context);
    return await post(me.config, "hal9.run(params.pipeline, params.context)", {
      pipeline: pipeline,
      context: context,
    }, {
      longlisten: true
    })
  };

  me.runPipeline = async (pipelineid, context) => {
    enhanceContext(context);
    return await post(me.config, "hal9.runPipeline(params.pipelineid, params.context)", {
      pipelineid: pipelineid,
      context: context,
    }, {
      longlisten: true
    })
  };

  me.remote = {
    input: remote.remoteInput,
    output: remote.remoteOutput,
  },

  me.environment = {
    setEnv: async (env) => {
      await environment.setEnv(env);
      return await post(me.config, "hal9.environment.setEnv(params.env)", {
        env: env,
      });
    },
    isElectron: environment.isElectron,
    isIOS: environment.isIOS,
    isDevelopment: environment.isDevelopment,
    getId: environment.getId,
    getServerUrl: environment.getServerUrl,
    getServerCachedUrl: environment.getServerCachedUrl,
    getWebsiteUrl: environment.getWebsiteUrl,
    getLibraryUrl: environment.getLibraryUrl,
    isNotProduction: environment.isNotProduction
  };

  me.events = {
    onChange: (changes) => {
      const callback = me.options?.events?.onChange;
      if (callback) callback(changes);
    }
  };

  me.datasets = {
    save: async (dataurl) => {
      return await post(me.config, "hal9.datasets.save(params.dataurl)", {
        dataurl: dataurl,
      })
    }
  };

  me.executors = {
    LocalExecutor: LocalExecutor
  }

  me.utils = {
    clone: clone
  },

  me.pipelines = {
    create: async (steps) => {
      return await post(me.config, "hal9.pipelines.create(params.steps)", {
        steps: steps,
      })
    },
    update: async (pipelineid, steps) => {
      return await post(me.config, "hal9.pipelines.update(params.pipelineid, params.steps)", {
        pipelineid: pipelineid,
        steps: steps,
      })
    },
    remove: async (pipelineid) => {
      return await post(me.config, "hal9.pipelines.remove(params.pipelineid)", {
        pipelineid: pipelineid,
      })
    },
    runStep: async (pipelineid, sid, context, partial) => {
      if (!context) context = {};
      enhanceContext(context);
      return await post(me.config, "hal9.pipelines.runStep(params.pipelineid, params.sid, params.context, params.partial)", {
        pipelineid: pipelineid,
        sid: sid,
        context: context,
        partial: partial,
      }, {
        longlisten: true
      })
    },
    run: async (pipelineid, context, partial, stepstopid) => {
      enhanceContext(context);
      return await post(me.config, "hal9.pipelines.run(params.pipelineid, params.context, params.partial, params.stepstopid)", {
        pipelineid: pipelineid,
        context: context,
        partial: partial,
        stepstopid: stepstopid,
      }, {
        longlisten: true
      })
    },
    getError: async (pipelineid) => {
      return await post(me.config, "hal9.pipelines.getError(params.pipelineid)", {
        pipelineid: pipelineid,
      })
    },
    getParams: async (pipelineid, sid) => {
      return await post(me.config, "hal9.pipelines.getParams(params.pipelineid, params.sid)", {
        pipelineid: pipelineid,
        sid: sid,
      })
    },
    setParams: async (pipelineid, sid, params) => {
      return await post(me.config, "hal9.pipelines.setParams(params.pipelineid, params.sid, params.params)", {
        pipelineid: pipelineid,
        sid: sid,
        params: params,
      })
    },
    mergeParams: async (pipelineid, sid, params) => {
      return await post(me.config, "hal9.pipelines.mergeParams(params.pipelineid, params.sid, params.params)", {
        pipelineid: pipelineid,
        sid: sid,
        params: params,
      })
    },
    getSteps: async (pipelineid) => {
      return await post(me.config, "hal9.pipelines.getSteps(params.pipelineid)", {
        pipelineid: pipelineid,
      })
    },
    getStepsWithHeaders: async (pipelineid) => {
      return await post(me.config, "hal9.pipelines.getStepsWithHeaders(params.pipelineid)", {
        pipelineid: pipelineid,
      })
    },
    updateStep: async (pipelineid, step) => {
      return await post(me.config, "hal9.pipelines.updateStep(params.pipelineid, params.step)", {
        pipelineid: pipelineid,
        step: step,
      })
    },
    addStep: async (pipelineid, step) => {
      return await post(me.config, "hal9.pipelines.addStep(params.pipelineid, params.step)", {
        pipelineid: pipelineid,
        step: step,
      })
    },
    removeStep: async (pipelineid, step) => {
      return await post(me.config, "hal9.pipelines.removeStep(params.pipelineid, params.step)", {
        pipelineid: pipelineid,
        step: step,
      })
    },
    moveStep: async (pipelineid, stepid, change) => {
      return await post(me.config, "hal9.pipelines.moveStep(params.pipelineid, params.stepid, params.change)", {
        pipelineid: pipelineid,
        stepid: stepid,
        change: change,
      })
    },
    getNested: async (pipelineid) => {
      return await post(me.config, "hal9.pipelines.getNested(params.pipelineid)", {
        pipelineid: pipelineid,
      })
    },
    getStep: async (pipelineid, sid) => {
      return await post(me.config, "hal9.pipelines.getStep(params.pipelineid, params.sid)", {
        pipelineid: pipelineid,
        sid: sid,
      })
    },
    getRebindablesForStep: async (pipelineid, step) => {
      return await post(me.config, "hal9.pipelines.getRebindablesForStep(params.pipelineid, params.step)", {
        pipelineid: pipelineid,
        step: step,
      })
    },
    getSources: async (pipelineid, sid) => {
      return await post(me.config, "hal9.pipelines.getSources(params.pipelineid, params.sid)", {
        pipelineid: pipelineid,
        sid: sid,
      })
    },
    getStepError: async (pipelineid, sid) => {
      return await post(me.config, "hal9.pipelines.getStepError(params.pipelineid, params.sid)", {
        pipelineid: pipelineid,
        sid: sid,
      })
    },
    setScript: async (pipelineid, sid, script) => {
      return await post(me.config, "hal9.pipelines.setScript(params.pipelineid, params.sid, params.script)", {
        pipelineid: pipelineid,
        sid: sid,
        script: script,
      })
    },
    getScript: async (pipelineid, sid) => {
      return await post(me.config, "hal9.pipelines.getScript(params.pipelineid, params.sid)", {
        pipelineid: pipelineid,
        sid: sid,
      })
    },
    getHashable: async (pipelineid) => {
      return await post(me.config, "hal9.pipelines.getHashable(params.pipelineid)", {
        pipelineid: pipelineid,
      })
    },
    load: async (pipeline) => {
      return await post(me.config, "hal9.pipelines.load(params.pipeline)", {
        pipeline: pipeline,
      })
    },
    getMaxId: async (pipelineid) => {
      return await post(me.config, "hal9.pipelines.getMaxId(params.pipelineid)", {
        pipelineid: pipelineid,
      })
    },
    getGlobal: async (pipelineid, name) => {
      return await post(me.config, "hal9.pipelines.getGlobal(params.pipelineid, params.name)", {
        pipelineid: pipelineid,
        name: name,
      })
    },
    setGlobal: async (pipelineid, name, data) => {
      return await post(me.config, "hal9.pipelines.setGlobal(params.pipelineid, params.name, params.data)", {
        pipelineid: pipelineid,
        name: name,
        data: data,
      })
    },
    getGlobalNames: async (pipelineid) => {
      return await post(me.config, "hal9.pipelines.getGlobalNames(params.pipelineid)", {
        pipelineid: pipelineid,
      })
    },
    getGlobals: async (pipelineid) => {
      return await post(me.config, "hal9.pipelines.getGlobals(params.pipelineid)", {
        pipelineid: pipelineid,
      })
    },
    invalidateStep: async (pipelineid, sid) => {
      return await post(me.config, "hal9.pipelines.invalidateStep(params.pipelineid, params.sid)", {
        pipelineid: pipelineid,
        sid: sid,
      })
    },
    setMetadataProperty: async (pipelineid, name, value) => {
      return await post(me.config, "hal9.pipelines.setMetadataProperty(params.pipelineid, params.name, params.value)", {
        pipelineid: pipelineid,
        name: name,
        value: value,
      })
    },
    getMetadata: async (pipelineid) => {
      return await post(me.config, "hal9.pipelines.getMetadata(params.pipelineid)", {
        pipelineid: pipelineid,
      })
    },
    setAppProperty: async (pipelineid, name, value) => {
      return await post(me.config, "hal9.pipelines.setAppProperty(params.pipelineid, params.name, params.value)", {
        pipelineid: pipelineid,
        name: name,
        value: value,
      })
    },
    getApp: async (pipelineid) => {
      return await post(me.config, "hal9.pipelines.getApp(params.pipelineid)", {
        pipelineid: pipelineid,
      })
    },
    remoteInput: () => {
      throw 'This API should only be used from third party sites';
    },
    remoteOutput: (result) => {
      return 'This API should only be used from third party sites';
    },
    abort: async (pipelineid) => {
      return await post(me.config, "hal9.pipelines.abort(params.pipelineid)", {
        pipelineid: pipelineid,
      })
    },
    isAborted: async (pipelineid) => {
      return await post(me.config, "hal9.pipelines.isAborted(params.pipelineid)", {
        pipelineid: pipelineid,
      })
    }
  };
    

  me.exportto = {
    getSaveText: async (pipelineid, padding, alsoSkip) => {
      return await post(me.config, "hal9.exportto.getSaveText(params.pipelineid, params.padding, params.alsoSkip)", {
        pipelineid: pipelineid,
        padding: padding,
        alsoSkip: alsoSkip,
      })
    },
    getHtml: async (pipelineid) => {
      return await post(me.config, "hal9.exportto.getHtml(params.pipelineid)", {
        pipelineid: pipelineid,
      })
    },
    getHtmlRemote: async (pipelinepath) => {
      return await post(me.config, "hal9.exportto.getHtmlRemote(params.pipelinepath)", {
        pipelinepath: pipelinepath,
      })
    },
    getPythonScript: async (pipelineid) => {
      return await post(me.config, "hal9.exportto.getPythonScript(params.pipelineid)", {
        pipelineid: pipelineid,
      })
    },
    getRScript: async (pipelineid) => {
      return await post(me.config, "hal9.exportto.getRScript(params.pipelineid)", {
        pipelineid: pipelineid,
      })
    },
  };

  me.screenshot = {
    capture: async (output, options = {}) => {
      return await post(me.config, "hal9.screenshot.capture(params.output, params.options)", {
        output: output,
        options: options
      })
    },
    resize: async (sourceImageData, width, height) => {
      return await post(me.config, "hal9.screenshot.resize(params.sourceImageData, params.width, params.height)", {
        sourceImageData: sourceImageData,
        width: width,
        height: height
      })
    },
  };

  me.htmloutput = {
    setIframeStyle: (name, value) => {
      me.config.iframe.style[name] = value;
    },
    getScrollWidth: async () => {
      return await post(me.config, "hal9.htmloutput.getScrollWidth()", {
      })
    },
    getScrollLeft: async () => {
      return await post(me.config, "hal9.htmloutput.getScrollLeft()", {
      })
    },
    setScrollLeft: async (pixels) => {
      return await post(me.config, "hal9.htmloutput.setScrollLeft(params.pixels)", {
        pixels: pixels
      })
    },
    getScrollHeight: async () => {
      return await post(me.config, "hal9.htmloutput.getScrollHeight()", {
      })
    },
    getScrollTop: async () => {
      return await post(me.config, "hal9.htmloutput.getScrollTop()", {
      })
    },
    setScrollTop: async (pixels) => {
      return await post(me.config, "hal9.htmloutput.setScrollTop(params.pixels)", {
        pixels: pixels
      })
    },
  },

  me.layout = {
    regenerateForDocumentView: async (pipelineid, removeOldLayout) => {
      return await post(me.config, "hal9.layout.regenerateForDocumentView(params.pipelineid, params.removeOldLayout)", {
        pipelineid: pipelineid,
        removeOldLayout: removeOldLayout,
      })
    },
    storeAppStepLayouts: async (pipelineid) => {
      return await post(me.config, "hal9.layout.storeAppStepLayouts(params.pipelineid)", {
        pipelineid: pipelineid,
      })
    },
    applyStepLayoutsToApp: async (stepLayouts) => {
      return await post(me.config, "hal9.layout.applyStepLayoutsToApp(params.stepLayouts)", {
        stepLayouts: stepLayouts,
      })
    },
    setHal9StepOverflowProperty: async (overflowValue) => {
      return await post(me.config, "hal9.layout.setHal9StepOverflowProperty(params.overflowValue)", {
        overflowValue: overflowValue,
      })
    }
  };

  me.stepapi = {
    create: stepapi.create,
  };

  me.dataframe = {
    isDataFrame: dataframe.isDataFrame,
    columns: dataframe.columns,
    clone: dataframe.clone,
    serialize: dataframe.serialize,
    deserialize: dataframe.deserialize,
    isSerialized: dataframe.isSerialized,
    ensure: dataframe.ensure,
    top: dataframe.top,
    toRows: dataframe.toRows,
    setDeps: dataframe.setDeps,
  };

  me.developer = {
    components: components,
  };
}

export const init = async (options, hal9wnd) => {
  fnCallbacks = [];
  hal9wnd = hal9wnd ? hal9wnd : {};
  var config = {};

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
  iframe.style.margin = 0;
  iframe.style.padding = 0;

  var secret = Math.random();
  const iframehtml = `
    <!DOCTYPE html>
    <html style="height: 100%">
      <head>
        <base target="_blank">
        <script src='${options.api}'></script>
        <style>${ options.css ?? ''}</style>
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
        ${ options.editable ? getDesignerLoaderHtml(secret) : '' }
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

  if (options.editable) registerDesignerLoader(html, iframe, secret, options.pipeline);

  config = {
    iframe: iframe,
    secret: secret,
    postId: 0
  };

  // per-iframe API used to initialize multiple instances with different iframes
  const api = new IFrameAPI(options, hal9wnd, config);

  await api.init({
    html: 'output',
    makeglobal: true
  }, {});

  return api;
}
