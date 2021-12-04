import * as environment from '../core/utils/environment';
import * as workers from '../core/workers';
import * as pipelines from '../core/pipelines';
import * as datasets from '../core/datasets';
import * as pipelineremote from '../core/pipelineremote';

import LocalExecutor from '../core/executors/local';

import clone from '../core/utils/clone';
import functions from '../core/utils/functions';

const runRemote = async (lambda, context) => {
  if (typeof(lambda) != 'function') {
    throw new 'The "run" function expecta a lambda function as parameter';
  }

  const server = environment.getServerUrl();
  const workerUrl = await workers.getValidWorkerUrl();

  var res = await fetch(workerUrl + '/execute', {
    method: 'POST',
    body: JSON.stringify({ operation: 'runlambda', lambda: lambda.toString(), context: context ? context : {} }),
    headers: { 'Content-Type': 'application/json' }
  });

  if (!res.ok) {
    var details = res.statusText;
    try {
      details = await res.json();
    }
    catch (e) {}
    throw 'Failed to execute lambda on remote worker: ' + details;
  }

  return await res.json();
};

const runPipeline = async (pipelineid, context) => {
  if (!context) context = {};
  var updated = await pipelines.run(
    pipelineid,
    Object.assign(context, {
      html: context.html ? context.html : function(step) {
        return step.html ? document.getElementById(step.html) : undefined;
      }
    }),
    function(pipeline, step, result, error, details) {
    }
  );

  var error = pipelines.getError(updated);
  if (error) throw(error);
}

const runSteps = async (steps, context) => {
  var pipeline = pipelines.create(steps);
  return runPipeline(pipeline, context);
}

export function create(steps) {
  return pipelines.create(steps);
}

export async function run(pipeline, context) {
  var type = typeof(pipeline);
  if (Array.isArray(pipeline)) type = 'array';

  var dispatch = {
    'function': runRemote,
    'array': runSteps,
    'string': pipelineremote.runPipelineRemote,
    'number': runPipeline,
  }

  await dispatch[type](pipeline, context);
};

var maxStepId = 0;
export function step(url, params, output) {

  // convert param values to pipeline params
  Object.keys(params).forEach(e => {
    var val = params[e];
    var valArray =  Array.isArray(val) ? val : [ val ];
    var valEntries = valArray.map(e => ({ value: e }));
    params[e] = { value: valEntries, name: e };
  });

  return {
    id: maxStepId++,
    url: url,
    params: params,
    html: output
  }
};

export function load(raw) {
  const pipeline = typeof(raw) === 'string' ? JSON.parse(decodeURIComponent(escape(atob(raw)))) : raw;
  return pipelines.load(pipeline);
}

export async function fetchPipeline(pipelinepath) {
  const user = pipelinepath.split('/')[0];
  const pipelinename = pipelinepath.split('/')[1];
  const serverurl = environment.getServerUrl();
  const pipelineInfo = `${serverurl}/api/users/${user}/pipelines/${pipelinename}`;

  var serverId = environment.getId();
  let s3Name = (serverId == 'dev' ? 'devel' : serverId) + 'hal9';

  const infoResp = await fetch(pipelineInfo, {
  });

  const infoData = await infoResp.json();

  const filename = infoData.filename;
  const downloadUrl = `https://${s3Name}.s3.us-west-2.amazonaws.com/pipeline/${filename}.pln`;

  const pipelineResp = await fetch(downloadUrl, {
  });

  return await pipelineResp.json();
}

export default {
  run: run,
  step: step,
  create: create,
  environment: environment,
  workers: workers,
  pipelines: pipelines,
  datasets: datasets,
  load: load,
  fetch: fetchPipeline,
  utils: {
    clone: clone,
    functions: functions,
  },
  executors: {
    LocalExecutor: LocalExecutor
  }
};

