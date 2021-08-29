import * as environment from '../core/utils/environment';
import * as workers from '../core/workers';
import * as pipelines from '../core/pipelines';
import * as datasets from '../core/datasets';

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
  var updated = await pipelines.run(
    pipelineid,
    {
      html: function(step) {
        return step.html ? document.getElementById(step.html) : undefined;
      }
    },
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

export async function run(pipeline, context) {
  var type = typeof(pipeline);
  if (Array.isArray(pipeline)) type = 'array';

  var dispatch = {
    'function': runRemote,
    'array': runSteps,
  }

  await dispatch[type](pipeline, context);
};


export function step(url, params, output) {
  return {
    url: url,
    params: params,
    html: output
  }
};

export default {
  run: run,
  step: step,
  environment: environment,
  workers: workers,
  pipelines: pipelines,
  datasets: datasets,
  utils: {
    clone: clone,
    functions: functions,
  }
};

