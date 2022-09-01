
import * as pipelines from '../core/pipelines';
import * as localparams from './executors/params';

import clone from './utils/clone';

const RuntimeAPI = function(pipelineid, sid, context, params, input) {
  const me = this;

  me.addStepEvent = function(pipelineid, sid, name, callback) {
    var current = pipelines.getState(pipelineid, sid);
    current = current ? current : {};
    current.events = current.events ? current.events : {};
    current.events[name] = current.events[name] ? current.events[name] : [];
    current.events[name].push(callback);
    pipelines.setState(pipelineid, sid, current);
  }

  // Retrieves the current pipeline as embedable html
  this.setHtml = function(html) {
    this.html = html;
  }

  this.getHtml = function() {
    return this.html;
  }
  
  // Saves some state for the current pipeline step
  this.setState = function(state, invalidate) {
    var current = pipelines.getState(pipelineid, sid);
    current = current ? current : {};
    current.api = state;
    pipelines.setState(pipelineid, sid, current);
    if (invalidate) this.invalidate();
  }
  
  // Loads the state for the current pipeline step
  this.getState = function(defaultValue) {
    if (!defaultValue) defaultValue = {};
    var current = pipelines.getState(pipelineid, sid);
    var state = current ? current.api : undefined;
    return state ? state : defaultValue;
  };

  // Updates state for a given dictionary value
  this.updateState = function(entry, value, invalidate) {
    var current = pipelines.getState(pipelineid, sid);
    current = current ? current : {};
    current.api = current.api ? current.api : {};
    if (value) current.api[entry] = value;
    pipelines.setState(pipelineid, sid, current);
    if (invalidate) this.invalidate();
    return current.api[entry];
  };
  
  // Notify that a pipeline step has changed
  this.invalidate = function() {
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
  };

  // Notify when invalidation triggers
  this.onInvalidate = function(callback) {
    pipelines.setCallback(pipelineid, sid, 'onInvalidate', callback);
  }

  // Is UI running in dark mode?
  this.isDark = function() {
    return context.dark;
  }

  this.getParams = function(index) {
    const sidCurrent = index == undefined ? sid : pipelines.stepIdFromIdx(pipelineid, index);

    return pipelines.getParams(pipelineid, sidCurrent);
  }

  this.setParams = function(params, index) {
    const sidCurrent = index == undefined ? sid : pipelines.stepIdFromIdx(pipelineid, index);

    pipelines.setParams(pipelineid, sidCurrent, params);
    if (context.invalidateSteps) {
      context.invalidateSteps();
    }
  }

  this.getParam = function(name) {
    const local = localparams.paramsForFunction(params, input, {})
    return local[name];
  }
  
  this.getInput = function(index) {
    return input;
  }

  this.isAborted = async function() {
    return pipelines.isAborted(pipelineid);
  }

  this.isDocument = function() {
    return context.stopid === null || context.stopid === undefined;
  }
  
  this.stop = function() {
    context.stopped = true;
  }

  this.getOutputs = function() {
    return pipelines.getGlobals(pipelineid);
  }

  this.triggerEvent = function(name, value) {
    const step = pipelines.getStep(pipelineid, sid);
    const callback = context?.events?.onEvent;
    if (callback) callback(step, name, value);
  };
  
  this.onEvent = function(name, callback) {
    if (!callback) return;
    this.addStepEvent(pipelineid, sid, name, callback);
  }
  
  this.set = function(name, value) {
    this.triggerEvent('on_update', [ value ]);
    this.updateState(name, value, true);
  }

  this.get = function(name) {
    return this.getState({})[name];
  }
}

export const create = function(pipelineid, sid, context, params, input) {
  return new RuntimeAPI(pipelineid, sid, context, params, input);
}
