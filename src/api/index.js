import * as native from './native';
import * as environment from '../core/utils/environment';
import * as datasets from '../core/datasets';
import LocalExecutor from '../core/executors/local';
import * as pipelines from '../core/pipelines';
import * as iframe from './iframe';

import clone from '../core/utils/clone';
import functions from '../core/utils/functions';

var api = native;
function init(options) {
  if (options.iframe) {
    api = iframe;
    return iframe.init(options);
  }
  else {
    api = native;
  }
}

function create(steps) {
  return api.create(steps);
}

async function run(pipeline, context) {
  return await api.run(pipeline, context);
};

function step(url, params, output) {
  return api.step(url, params, output);
};

function load(raw) {
  return api.load(raw);
}

async function fetchPipeline(pipelinepath) {
  return await api.fetchPipeline(pipelinepath);
}

function setEnv(env) {
  return environment.setEnv(env);
}

export default {
  init: init,
  create: create,
  step: step,
  load: load,
  fetch: fetchPipeline,
  run: run,

  environment: {
    isElectron: environment.isElectron,
    isIOS: environment.isIOS,
    setEnv: setEnv,
    isDevelopment: environment.isDevelopment,
    getId: environment.getId,
    getServerUrl: environment.getServerUrl,
    getServerCachedUrl: environment.getServerCachedUrl,
    getWebsiteUrl: environment.getWebsiteUrl,
    getLibraryUrl: environment.getLibraryUrl
  },

  pipelines: {
    create: pipelines.create,
    update: pipelines.update,
    remove: pipelines.remove,
    runStep: pipelines.runStep,
    run: pipelines.run,
    getError: pipelines.getError,
    getParams: pipelines.getParams,
    setParams: pipelines.setParams,
    mergeParams: pipelines.mergeParams,
    getSteps: pipelines.getSteps,
    updateStep: pipelines.updateStep,
    addStep: pipelines.addStep,
    removeStep: pipelines.removeStep,
    moveStep: pipelines.moveStep,
    getNested: pipelines.getNested,
    getStep: pipelines.getStep,
    getSources: pipelines.getSources,
    getStepError: pipelines.getStepError,
    setScript: pipelines.setScript,
    getScript: pipelines.getScript,
    getHashable: pipelines.getHashable,
    getSaveText: pipelines.getSaveText,
    load: pipelines.load,
    getMaxId: pipelines.getMaxId,
    getGlobal: pipelines.getGlobal,
    setGlobal: pipelines.setGlobal,
    getGlobalNames: pipelines.getGlobalNames,
    invalidateStep: pipelines.invalidateStep,
    getHtml: pipelines.getHtml,
    getHtmlRemote: pipelines.getHtmlRemote,
    updateMetadata: pipelines.updateMetadata,
    getMetadata: pipelines.getMetadata,
  },

  datasets: {
    save: datasets.save,
  },

  utils: {
    clone: clone,
    functions: functions,
  },

  executors: {
    LocalExecutor: LocalExecutor,
  }
};

