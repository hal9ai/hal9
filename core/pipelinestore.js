import clone from './utils/clone';

var pipelinelast = 0;
var pipelineids = {};

export const add = function(pipeline /* pipeline */) /* pipelineid */ {
  const pipelineid = pipelinelast++;
  pipelineids[pipelineid] = clone(pipeline);
  return pipelineid
}

export const remove = function(pipelineid /* pipelineid */) /* pipeline */ {
  const pipeline = pipelineids[pipelineid];
  if (pipeline) delete pipelineids[pipelineid];
  return pipeline ? pipeline : {};
}

export const get = function(pipelineid /* pipelineid */) /* pipeline */ {
  const pipeline = pipelineids[pipelineid];
  if (!pipeline) throw('Pipeline ' + pipelineid + ' not found.');
  return pipeline;
}

export const update = function(pipelineid /* pipelineid */, pipeline /* pipeline */) /* void */ {
  const pipelineold = pipelineids[pipelineid];
  if (!pipelineold) throw('Pipeline ' + pipelineid + ' not found.');
  pipelineids[pipelineid] = clone(pipeline);
}
