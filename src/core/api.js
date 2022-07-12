
import * as pipelines from '../core/pipelines';
import * as localparams from './executors/params';

import clone from './utils/clone';

export const create = (pipelineid, sid, context, params, input) => {
  return {
    // Retrieves the current pipeline as embedable html
    setHtml: function(html) {
      this.html = html;
    },
    getHtml: function() {
      return this.html;
    },
    // Saves some state for the current pipeline step
    setState: function(state) {
      var current = pipelines.getState(pipelineid, sid);
      current = current ? current : {};
      current.api = state;
      pipelines.setState(pipelineid, sid, current);
    },
    // Loads the state for the current pipeline step
    getState: function() {
      var current = pipelines.getState(pipelineid, sid);
      return current ? current.api : {};
    },
    // Notify that a pipeline step has changed
    invalidate: function() {
      if (context.invalidateSteps) {
        pipelines.invalidateStep(pipelineid, sid);
        context.invalidateSteps();
      }
    },
    // Notify when invalidation triggers
    onInvalidate: function(callback) {
      pipelines.setCallback(pipelineid, sid, 'onInvalidate', callback);
    },
    // Is UI running in dark mode?
    isDark: function() {
      return context.dark;
    },
    getParams: function(index) {
      const sidCurrent = index == undefined ? sid : pipelines.stepIdFromIdx(pipelineid, index);

      return pipelines.getParams(pipelineid, sidCurrent);
    },
    setParams: function(params, index) {
      const sidCurrent = index == undefined ? sid : pipelines.stepIdFromIdx(pipelineid, index);

      pipelines.setParams(pipelineid, sidCurrent, params);
      if (context.invalidateSteps) {
        context.invalidateSteps();
      }
    },
    getParam: function(name) {
      const local = localparams.paramsForFunction(params, input, {})
      return local[name];
    },
    getInput: function(index) {
      return input;
    },
    isAborted: async function() {
      return pipelines.isAborted(pipelineid);
    },
    isDocument: function() {
      return context.stopid === null || context.stopid === undefined;
    },
    stop: function() {
      context.stopped = true;
    },
    getOutputs: function() {
      return pipelines.getGlobals(pipelineid);
    }
  }
}
