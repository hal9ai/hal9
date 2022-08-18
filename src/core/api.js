
import * as pipelines from '../core/pipelines';
import * as localparams from './executors/params';

import clone from './utils/clone';

export const create = (pipelineid, sid, context, params, input) => {
  const doInvalidate = function() {
    const callback = context?.events?.onInvalidate;
    if (callback) {
      const step = pipelines.getStep(pipelineid, sid);
      callback(step);
    }
    else if (context.invalidateSteps) {
      pipelines.invalidateStep(pipelineid, sid);
      context.invalidateSteps();
    }
    else {
      pipelines.run(pipelineid, context);
    }
  }

  return {
    // Retrieves the current pipeline as embedable html
    setHtml: function(html) {
      this.html = html;
    },
    getHtml: function() {
      return this.html;
    },
    // Saves some state for the current pipeline step
    setState: function(state, invalidate) {
      var current = pipelines.getState(pipelineid, sid);
      current = current ? current : {};
      current.api = state;
      pipelines.setState(pipelineid, sid, current);
      if (invalidate) doInvalidate();
    },
    // Loads the state for the current pipeline step
    getState: function(defaultValue) {
      var current = pipelines.getState(pipelineid, sid);
      var state = current ? current.api : {};
      return state ? state : defaultValue;
    },
    // Updates state for a given dictionary value
    updateState: function(entry, value, invalidate) {
      var current = pipelines.getState(pipelineid, sid);
      current = current ? current : {};
      current.api = current.api ? current.api : {};
      if (value) current.api[entry] = value;
      pipelines.setState(pipelineid, sid, current);
      if (invalidate) doInvalidate();
      return current.api[entry];
    },
    // Notify that a pipeline step has changed
    invalidate: doInvalidate,
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
    },
    triggerEvent: function(name, value) {
      const step = pipelines.getStep(pipelineid, sid);
      const callback = context?.events?.onEvent;
      if (callback) callback(step, name, value);
    }
  }
}
