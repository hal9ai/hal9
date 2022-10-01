import * as remote from '../remote/remote';
import * as environment from '../core/utils/environment';
import * as datasets from '../core/datasets';
import LocalExecutor from '../core/executors/local';
import clone from '../core/utils/clone';
import * as pipelines from '../core/pipelines';
import * as exportto from '../core/exportto';
import * as screenshot from '../core/utils/screenshot'
import * as htmloutput from '../core/htmloutput';
import * as layout from '../core/layout';
import * as stepapi from '../core/api';
import * as dataframe from '../core/utils/dataframe';
import * as workers from '../core/workers';
import components from '../../scripts/components.json';

export const internal = {
  remote: {
    input: remote.remoteInput,
    output: remote.remoteOutput,
  },

  environment: {
    isElectron: environment.isElectron,
    isIOS: environment.isIOS,
    setEnv: environment.setEnv,
    isDevelopment: environment.isDevelopment,
    getId: environment.getId,
    getServerUrl: environment.getServerUrl,
    getServerCachedUrl: environment.getServerCachedUrl,
    getWebsiteUrl: environment.getWebsiteUrl,
    getLibraryUrl: environment.getLibraryUrl,
    isNotProduction: environment.isNotProduction
  },

  datasets: {
    save: datasets.save,
  },

  executors: {
    LocalExecutor: LocalExecutor,
  },

  utils: {
    clone: clone,
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
    getStepsWithHeaders: pipelines.getStepsWithHeaders,
    updateStep: pipelines.updateStep,
    addStep: pipelines.addStep,
    removeStep: pipelines.removeStep,
    moveStep: pipelines.moveStep,
    getNested: pipelines.getNested,
    getStep: pipelines.getStep,
    getRebindablesForStep: pipelines.getRebindablesForStep,
    getSources: pipelines.getSources,
    getStepError: pipelines.getStepError,
    setScript: pipelines.setScript,
    getScript: pipelines.getScript,
    getHashable: pipelines.getHashable,
    load: pipelines.load,
    getMaxId: pipelines.getMaxId,
    getGlobal: pipelines.getGlobal,
    setGlobal: pipelines.setGlobal,
    getGlobalNames: pipelines.getGlobalNames,
    getGlobals: pipelines.getGlobals,
    invalidateStep: pipelines.invalidateStep,
    setMetadataProperty: pipelines.setMetadataProperty,
    getMetadata: pipelines.getMetadata,
    setAppProperty: pipelines.setAppProperty,
    getApp: pipelines.getApp,
    abort: pipelines.abort,
    isAborted: pipelines.isAborted,
    getDependencies: pipelines.getDependencies,
    addDependency: pipelines.addDependency,
    removeDependency: pipelines.removeDependency,
    getRuntimeSpecs: pipelines.getRuntimeSpecs,
    addRuntimeSpec: pipelines.addRuntimeSpec,
    getPipeline: pipelines.getPipeline,
    addPipeline: pipelines.addPipeline,
  },

  exportto: {
    getSaveText: exportto.getSaveText,
    getHtml: exportto.getHtml,
    getPythonScript: exportto.getPythonScript,
    getRScript: exportto.getRScript,
  },

  screenshot: {
    capture: screenshot.capture,
    resize: screenshot.resize,
  },

  htmloutput: {
    setIframeStyle: () => {},
    getScrollWidth: htmloutput.getScrollWidth,
    getScrollLeft: htmloutput.getScrollLeft,
    setScrollLeft: htmloutput.setScrollLeft,
    getScrollHeight: htmloutput.getScrollHeight,
    getScrollTop: htmloutput.getScrollTop,
    setScrollTop: htmloutput.setScrollTop,
  },

  layout: {
    regenerateForDocumentView: layout.regenerateForDocumentView,
    storeAppStepLayouts: layout.storeAppStepLayouts,
    applyStepLayoutsToApp: layout.applyStepLayoutsToApp,
    calcAppDimensions: layout.calcAppDimensions,
    setHal9StepOverflowProperty: layout.setHal9StepOverflowProperty,
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
  },

  workers: {
    getValidWorkerUrl: workers.getValidWorkerUrl
  }
}