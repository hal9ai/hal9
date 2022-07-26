import * as native from './native';
import * as environment from '../core/utils/environment';
import * as datasets from '../core/datasets';
import LocalExecutor from '../core/executors/local';
import * as pipelines from '../core/pipelines';
import * as iframe from './iframe';
import * as remote from '../remote/remote';
import * as stepapi from '../core/api';
import * as dataframe from '../core/utils/dataframe';

import components from '../../scripts/components.json';
import { launchDesigner } from './designer';

import clone from '../core/utils/clone';
import functions from '../core/utils/functions';

var api = native;
async function init(options, hal9wnd) {
  hal9wnd = hal9wnd ? hal9wnd : window.hal9;

  if (options.mode == 'design') {
    launchDesigner(options.html, options.pipeline)
    return;
  }

  if (options.iframe) {
    api = iframe;
    return await iframe.init(options, hal9wnd);
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

function step(url, params, output, options) {
  return api.step(url, params, output, options);
};

async function load(raw) {
  return await api.load(raw);
}

async function fetchPipeline(pipelinepath) {
  return await api.fetchPipeline(pipelinepath);
}

async function setEnv(env) {
  await api.setEnv(env);

  return environment.setEnv(env);
}

async function datasetsSave(dataurl) {
  return await api.datasetsSave(dataurl);
}

async function exporttoGetSaveText(pipelineid, padding, alsoSkip) {
  return await api.exporttoGetSaveText(pipelineid, padding, alsoSkip);
}

async function exporttoGetHtml(pipelineid) {
  return await api.exporttoGetHtml(pipelineid);
}

async function exporttoGetHtmlRemote(pipelinepath) {
  return await api.exporttoGetHtmlRemote(pipelinepath);
}

async function exporttoGetPythonScript(pipelineid) {
  return await api.exporttoGetPythonScript(pipelineid);
}

async function exporttoGetRScript(pipelineid) {
  return await api.exporttoGetRScript(pipelineid);
}

async function pipelinesCreate(steps) {
  return await api.pipelinesCreate(steps);
}

async function pipelinesUpdate(pipelineid, steps) {
  return await api.pipelinesUpdate(pipelineid, steps);
}

async function pipelinesRemove(pipelineid) {
  return await api.pipelinesRemove(pipelineid);
}

async function pipelinesRunStep(pipelineid, sid, context, partial) {
  return await api.pipelinesRunStep(pipelineid, sid, context, partial);
}

async function pipelinesRun(pipelineid, context, partial, stepstopid) {
  return await api.pipelinesRun(pipelineid, context, partial, stepstopid);
}

async function pipelinesGetError(pipelineid) {
  return await api.pipelinesGetError(pipelineid);
}

async function pipelinesGetParams(pipelineid, sid) {
  return await api.pipelinesGetParams(pipelineid, sid);
}

async function pipelinesSetParams(pipelineid, sid, params) {
  return await api.pipelinesSetParams(pipelineid, sid, params);
}

async function pipelinesMergeParams(pipelineid, sid, params) {
  return await api.pipelinesMergeParams(pipelineid, sid, params);
}

async function pipelinesGetSteps(pipelineid) {
  return await api.pipelinesGetSteps(pipelineid);
}

async function pipelinesGetStepsWithHeaders(pipelineid) {
  return await api.pipelinesGetStepsWithHeaders(pipelineid);
}

async function pipelinesUpdateStep(pipelineid, step) {
  return await api.pipelinesUpdateStep(pipelineid, step);
}

async function pipelinesAddStep(pipelineid, step) {
  return await api.pipelinesAddStep(pipelineid, step);
}

async function pipelinesRemoveStep(pipelineid, step) {
  return await api.pipelinesRemoveStep(pipelineid, step);
}

async function pipelinesMoveStep(pipelineid, stepid, change) {
  return await api.pipelinesMoveStep(pipelineid, stepid, change);
}

async function pipelinesGetNested(pipelineid) {
  return await api.pipelinesGetNested(pipelineid);
}

async function pipelinesGetStep(pipelineid, sid) {
  return await api.pipelinesGetStep(pipelineid, sid);
}

async function pipelinesGetRebindablesForStep(pipelineid, step) {
  return await api.pipelinesGetRebindablesForStep(pipelineid, step);
}

async function pipelinesGetSources(pipelineid, sid) {
  return await api.pipelinesGetSources(pipelineid, sid);
}

async function pipelinesGetStepError(pipelineid, sid) {
  return await api.pipelinesGetStepError(pipelineid, sid);
}

async function pipelinesSetScript(pipelineid, sid, script) {
  return await api.pipelinesSetScript(pipelineid, sid, script);
}

async function pipelinesGetScript(pipelineid, sid) {
  return await api.pipelinesGetScript(pipelineid, sid);
}

async function pipelinesGetHashable(pipelineid) {
  return await api.pipelinesGetHashable(pipelineid);
}

async function pipelinesLoad(pipeline) {
  return await api.pipelinesLoad(pipeline);
}

async function pipelinesGetMaxId(pipelineid) {
  return await api.pipelinesGetMaxId(pipelineid);
}

async function pipelinesGetGlobal(pipelineid, name) {
  return await api.pipelinesGetGlobal(pipelineid, name);
}

async function pipelinesSetGlobal(pipelineid, name, data) {
  return await api.pipelinesSetGlobal(pipelineid, name, data);
}

async function pipelinesGetGlobalNames(pipelineid) {
  return await api.pipelinesGetGlobalNames(pipelineid);
}

async function pipelinesGetGlobals(pipelineid) {
  return await api.pipelinesGetGlobals(pipelineid);
}

async function pipelinesInvalidateStep(pipelineid, sid) {
  return await api.pipelinesInvalidateStep(pipelineid, sid);
}

async function pipelinesSetMetadataProperty(pipelineid, name, value) {
  return await api.pipelinesSetMetadataProperty(pipelineid, name, value);
}

async function pipelinesGetMetadata(pipelineid) {
  return await api.pipelinesGetMetadata(pipelineid);
}

async function pipelinesSetAppProperty(pipelineid, name, value) {
  return await api.pipelinesSetAppProperty(pipelineid, name, value);
}

async function pipelinesGetApp(pipelineid) {
  return await api.pipelinesGetApp(pipelineid);
}

async function pipelinesAbort(pipelineid) {
  return await api.pipelinesAbort(pipelineid);
}

async function pipelinesIsAborted(pipelineid) {
  return await api.pipelinesIsAborted(pipelineid);
}

async function screenshotCapture(output, options = {}) {
  return await api.screenshotCapture(output, options);
}

async function screenshotResize(sourceImageData, width, height) {
  return await api.screenshotResize(sourceImageData, width, height);
}

function htmloutputSetIframeStyle(name, value) {
  return api.htmloutputSetIframeStyle(name, value);
}

async function htmloutputGetScrollWidth() {
  return await api.htmloutputGetScrollWidth();
}

async function htmloutputGetScrollLeft() {
  return await api.htmloutputGetScrollLeft();
}

async function htmloutputSetScrollLeft(pixels) {
  return await api.htmloutputSetScrollLeft(pixels);
}

async function htmloutputGetScrollHeight() {
  return await api.htmloutputGetScrollHeight();
}

async function htmloutputGetScrollTop() {
  return await api.htmloutputGetScrollTop();
}

async function htmloutputSetScrollTop(pixels) {
  return await api.htmloutputSetScrollTop(pixels);
}

async function layoutRegenerateForDocumentView(pipelineid, removeOldLayout) {
  return await api.layoutRegenerateForDocumentView(pipelineid, removeOldLayout);
}

async function layoutStoreAppStepLayouts(pipelineid) {
  return await api.layoutStoreAppStepLayouts(pipelineid);
}

async function layoutApplyStepLayoutsToApp(stepLayouts) {
  return await api.layoutApplyStepLayoutsToApp(stepLayouts);
}

async function layoutSetHal9StepOverflowProperty(overflowValue) {
  return await api.layoutSetHal9StepOverflowProperty(overflowValue);
}

export default {
  init: init,
  create: create,
  step: step,
  load: load,
  fetch: fetchPipeline,
  run: run,

  remote: {
    input: remote.remoteInput,
    output: remote.remoteOutput,
  },

  environment: {
    isElectron: environment.isElectron,
    isIOS: environment.isIOS,
    setEnv: setEnv,
    isDevelopment: environment.isDevelopment,
    getId: environment.getId,
    getServerUrl: environment.getServerUrl,
    getServerCachedUrl: environment.getServerCachedUrl,
    getWebsiteUrl: environment.getWebsiteUrl,
    getLibraryUrl: environment.getLibraryUrl,
    isNotProduction: environment.isNotProduction
  },

  datasets: {
    save: datasetsSave,
  },

  executors: {
    LocalExecutor: LocalExecutor,
  },

  utils: {
    clone: clone,
  },

  pipelines: {
    create: pipelinesCreate,
    update: pipelinesUpdate,
    remove: pipelinesRemove,
    runStep: pipelinesRunStep,
    run: pipelinesRun,
    getError: pipelinesGetError,
    getParams: pipelinesGetParams,
    setParams: pipelinesSetParams,
    mergeParams: pipelinesMergeParams,
    getSteps: pipelinesGetSteps,
    getStepsWithHeaders: pipelinesGetStepsWithHeaders,
    updateStep: pipelinesUpdateStep,
    addStep: pipelinesAddStep,
    removeStep: pipelinesRemoveStep,
    moveStep: pipelinesMoveStep,
    getNested: pipelinesGetNested,
    getStep: pipelinesGetStep,
    getRebindablesForStep: pipelinesGetRebindablesForStep,
    getSources: pipelinesGetSources,
    getStepError: pipelinesGetStepError,
    setScript: pipelinesSetScript,
    getScript: pipelinesGetScript,
    getHashable: pipelinesGetHashable,
    load: pipelinesLoad,
    getMaxId: pipelinesGetMaxId,
    getGlobal: pipelinesGetGlobal,
    setGlobal: pipelinesSetGlobal,
    getGlobalNames: pipelinesGetGlobalNames,
    getGlobals: pipelinesGetGlobals,
    invalidateStep: pipelinesInvalidateStep,
    setMetadataProperty: pipelinesSetMetadataProperty,
    getMetadata: pipelinesGetMetadata,
    setAppProperty: pipelinesSetAppProperty,
    getApp: pipelinesGetApp,
    abort: pipelinesAbort,
    isAborted: pipelinesIsAborted,
  },

  exportto: {
    getSaveText: exporttoGetSaveText,
    getHtml: exporttoGetHtml,
    getHtmlRemote: exporttoGetHtmlRemote,
    getPythonScript: exporttoGetPythonScript,
    getRScript: exporttoGetRScript,
  },

  screenshot: {
    capture: screenshotCapture,
    resize: screenshotResize,
  },

  htmloutput: {
    setIframeStyle: htmloutputSetIframeStyle,
    getScrollWidth: htmloutputGetScrollWidth,
    getScrollLeft: htmloutputGetScrollLeft,
    setScrollLeft: htmloutputSetScrollLeft,
    getScrollHeight: htmloutputGetScrollHeight,
    getScrollTop: htmloutputGetScrollTop,
    setScrollTop: htmloutputSetScrollTop,
  },

  layout: {
    regenerateForDocumentView: layoutRegenerateForDocumentView,
    storeAppStepLayouts: layoutStoreAppStepLayouts,
    applyStepLayoutsToApp: layoutApplyStepLayoutsToApp,
    setHal9StepOverflowProperty: layoutSetHal9StepOverflowProperty,
  },

  stepapi: {
    create: stepapi.create,
  },

  dataframe: {
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
  },

  developer: {
    components: components,
  }
};

