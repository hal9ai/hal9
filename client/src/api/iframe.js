import * as dataframe from '../core/utils/dataframe';
import { getDesignerLoaderHtml, registerDesignerLoader } from '../designer/launcher';

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
import * as workers from '../core/workers';

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
      onResult = async function(event) {
        if (!event.data || event.data.secret != secret || event.data.id != postId) return;

        if (event.data.callbackid !== undefined) {
          try {
            const result = await fnCallbacks[event.data.callbackid](...Object.values(event.data.params));
            iframe.contentWindow.postMessage({ secret: secret, id: postId, callbackid: event.data.callbackid, result: result }, '*');
          }
          catch (e) {
            iframe.contentWindow.postMessage({ secret: secret, id: postId, callbackid: event.data.callbackid, error: e }, '*');
          }
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
  me.workers = workers;

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
    return await post(me.config, "hal9.run(params.pipeline, params.context)", {
      pipeline: pipeline,
      context: context,
    }, {
      longlisten: true
    })
  };

  me.runPipeline = async (pipelineid, context) => {
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
      if (callback) {
        callback(changes);
      }
    },
    onRequestSave: () => {
      const callback = me.options?.events?.onRequestSave;
      if (callback) {
        callback();
      }
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
    },
    getDependencies: async (pipelineid) => {
      return await post(me.config, "hal9.pipelines.getDependencies(params.pipelineid)", {
        pipelineid: pipelineid,
      })
    },
    addDependency: async (pipelineid, source, target) => {
      return await post(me.config, "hal9.pipelines.addDependency(params.pipelineid, params.source, params.target)", {
        pipelineid: pipelineid,
        source: source,
        target: target,
      })
    },
    removeDependency: async (pipelineid, source, target) => {
      return await post(me.config, "hal9.pipelines.removeDependency(params.pipelineid, params.source, params.target)", {
        pipelineid: pipelineid,
        source: source,
        target: target,
      })
    },
    getRuntimeSpecs: async (pipelineid) => {
      return await post(me.config, "hal9.pipelines.getRuntimeSpecs(params.pipelineid)", {
        pipelineid: pipelineid,
      })
    },
    addRuntimeSpec: async (pipelineid, spec) => {
      return await post(me.config, "hal9.pipelines.addRuntimeSpec(params.pipelineid, params.spec)", {
        pipelineid: pipelineid,
        spec: spec,
      })
    },
    removeRuntime: async (pipelineid, name) => {
      return await post(me.config, "hal9.pipelines.removeRuntime(params.pipelineid, params.name)", {
        pipelineid: pipelineid,
        name: name,
      })
    },
    getPipeline: async (pipelineid) => {
      return await post(me.config, "hal9.pipelines.getPipeline(params.pipelineid)", {
        pipelineid: pipelineid,
      })
    },
    addPipeline: async (pipeline) => {
      return await post(me.config, "hal9.pipelines.addPipeline(params.pipeline)", {
        pipeline: pipeline,
      })
    },
  };
    

  me.exportto = {
    getSaveText: async (pipelineid, padding, alsoSkip) => {
      return await post(me.config, "hal9.exportto.getSaveText(params.pipelineid, params.padding, params.alsoSkip)", {
        pipelineid: pipelineid,
        padding: padding,
        alsoSkip: alsoSkip,
      })
    },
    getHtml: async (pipelineid, pipelinepath, htmlFormat, appDivId) => {
      return await post(me.config, "hal9.exportto.getHtml(params.pipelineid, params.pipelinepath, params.htmlFormat, params.appDivId)", {
        pipelineid: pipelineid,
        pipelinepath: pipelinepath,
        htmlFormat: htmlFormat,
        appDivId: appDivId,
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
    calcAppDimensions: async (stepLayouts) => {
      return await post(me.config, "hal9.layout.calcAppDimensions(params.stepLayouts)", {
        stepLayouts: stepLayouts,
      })
    },
    setHal9StepOverflowProperty: async (overflowValue) => {
      return await post(me.config, "hal9.layout.setHal9StepOverflowProperty(params.overflowValue)", {
        overflowValue: overflowValue,
      })
    }
  };

  me.backend = {
    backend: async (hostopt) => {
      return await post(me.config, "hal9.backend.backend(params.hostopt)", {
        hostopt: hostopt
      }, {
        longlisten: true
      })
    },
    getpid: async (bid) => {
      return await post(me.config, "hal9.backend.getpid(params.bid)", {
        bid: bid
      })
    },
    init: async (bid, pipelineid) => {
      return await post(me.config, "hal9.backend.init(params.bid, params.pipelineid)", {
        bid: bid,
        pipelineid: pipelineid
      })
    },
    getfile: async (bid, path) => {
      return await post(me.config, "hal9.backend.getfile(params.bid, params.path)", {
        bid: bid,
        path: path
      })
    },
    putFile: async (bid, runtime, path, contents) => {
      return await post(me.config, "hal9.backend.putFile(params.bid, params.runtime, params.path, params.contents)", {
        bid: bid,
        runtime: runtime,
        path: path,
        contents: contents
      })
    },
    onUpdated: async (bid) => {
      return await post(me.config, "hal9.backend.onUpdated(params.bid)", {
        bid: bid
      })
    },
    addRuntime: async (bid, spec) => {
      return await post(me.config, "hal9.backend.addRuntime(params.bid, params.spec)", {
        bid: bid,
        spec: spec
      })
    },
    initTerminal: async (bid, runtime, options) => {
      return await post(me.config, "hal9.backend.initTerminal(params.bid, params.runtime, params.options)", {
        bid: bid,
        runtime: runtime,
        options: options
      })
    },
    termRead: async (bid, tid, ondata) => {
      return await post(me.config, "hal9.backend.termRead(params.bid, params.tid, params.ondata)", {
        bid: bid,
        tid: tid,
        ondata: ondata
      }, {
        longlisten: true
      })
    },
    termWrite: async (bid, tid, input) => {
      return await post(me.config, "hal9.backend.termWrite(params.bid, params.tid, params.input)", {
        bid: bid,
        tid: tid,
        input: input
      }, {
        longlisten: true
      })
    },
    attachError: async (bid, error) => {
      return await post(me.config, "hal9.backend.attachError(params.bid, params.error)", {
        bid: bid,
        error: error
      })
    },
    onpid: async (bid, callback) => {
      return await post(me.config, "hal9.backend.onpid(params.bid, params.callback)", {
        bid: bid,
        callback: callback
      }, {
        longlisten: true
      })
    },
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
  iframe.allow = 'camera;microphone';
  // iframe.setAttribute('sandbox', 'allow-forms allow-downloads allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-scripts allow-same-origin');

  iframe.setAttribute('scrolling', 'no');
  var secret = Math.random();

  iframe.style.border = 'none';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.margin = 0;
  iframe.style.padding = 0;
  const iframeScript = `
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
            if (!event.data || event.data.secret != ${secret} || event.data.callbackid !== undefined) return;

            const deserializeFunction = (target) => {
              if (typeof(target) == 'object' && target) {
                Object.keys(target).forEach(key => {
                  if (typeof(target[key]) === 'string' && target[key].startsWith('___hal9___function___callback___')) {
                    const callbackid = parseInt(target[key].replace('___hal9___function___callback___', ''));
                    target[key] = async function () {
                      const rPromise = new Promise((a, r) => {
                        const waitForResult = function(er) {
                          if (!er.data || er.data.secret != ${secret} || er.data.id != event.data.id || er.data.callbackid != callbackid) return;
                          window.removeEventListener('message', waitForResult);
                          if (er.data.error) {
                            r(er.data.error);
                          } else {
                            a(er.data.result);
                          }
                        }
                        window.addEventListener('message', waitForResult)
                      });
                      window.parent.postMessage({ secret: ${secret}, id: event.data.id, callbackid: callbackid, params: JSON.parse(JSON.stringify(arguments)) }, '*');
                      return await rPromise;
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
`
  const scriptHeader = `<script src='${options.api}'></script>`;
  const outputDiv = `<div id="output" style="position: relative; width: 100%; height: 100%; overflow: auto;"></div>
        `;
  var iframehtml = `
    <!DOCTYPE html>
    <html style="height: 100%">
      <head>
        <base target="_blank">
        ${ scriptHeader }
        <style>${ options.css ?? ''}</style>
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
        ${ outputDiv }
        ${ iframeScript }
      </body>
    </html>
  `;

  let iframesrc;
  if (options.pipeline && options.pipeline.runtimes && options.pipeline.runtimes.some(e => e.implementation == 'html')) {
    const htmlruntime = options.pipeline.runtimes.filter(e => e.implementation == 'html')[0];
    iframehtml = htmlruntime.files[htmlruntime.script];

    iframehtml = iframehtml.replace(/<\/body>[\s\S]*<\/html>/, '');
    iframehtml = iframehtml.replace(/<script src=\".*hal9.*\.js\"><\/script>/, '');
    iframehtml = iframehtml.replace(/<script>[^]+ hal9\.run\([^]+<\/script>/, '');

    var newOutputDiv = '';
    if (!/<div id=\"output\" /.test(iframehtml)) {
      newOutputDiv = outputDiv;
    }

    iframehtml = iframehtml + `\n  ${newOutputDiv} ${ scriptHeader }\n  ${ iframeScript }\n  </body></html> `
  }

  if (options.contentsrv) {
    var res = await fetch(options.contentsrv, {
      method: 'POST',
      body: JSON.stringify({ content: iframehtml }),
      headers: { 'Content-Type': 'application/json' }
    });

    const contentdata = await res.json();
    iframesrc = options.contentsrv + '/' + contentdata.id;
  }

  if (!iframesrc) iframesrc = 'data:text/html;charset=utf-8,' + encodeURIComponent(iframehtml);
  iframe.src = iframesrc;

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
