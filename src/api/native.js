import * as environment from '../core/utils/environment';
import * as workers from '../core/workers';
import * as pipelines from '../core/pipelines';
import * as pipelineremote from '../core/pipelineremote';
import * as datasets from '../core/datasets';
import * as screenshot from '../core/utils/screenshot';
import * as htmloutput from '../core/htmloutput';
import * as layout from '../core/layout';
import * as exportto from '../core/exportto';
import { internal } from './internal';

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
export function step(url, params, output, options) {
  let step = {
    id: maxStepId++,
    html: output,
    options: options
  };

  if (!url && params.script) {
    step.inlineScript = params.script;
    step.inlineScriptLanguage = params.language ?? 'javascript';
  } else {
    // convert param values to pipeline params
    Object.keys(params).forEach(e => {
      var val = params[e];
      var valArray =  Array.isArray(val) ? val : [ val ];
      var valEntries = valArray.map(e => ({ value: e }));
      params[e] = { value: valEntries, name: e };
    });
    step.url = url;
    step.params = params;
  }

  return step;
};

export async function load(raw) {
  const pipeline = typeof(raw) === 'string' ? JSON.parse(decodeURIComponent(escape(atob(raw)))) : raw;
  return await pipelines.load(pipeline);
}

export async function fetchPipeline(pipelinepath) {
  const user = pipelinepath.split('/')[0];
  const pipelinename = pipelinepath.split('/')[1];
  const serverurl = environment.getServerCachedUrl();
  const pipelineInfo = `${serverurl}/api/users/${user}/pipelines/${pipelinename}`;

  var serverId = environment.getId();
  let s3Name = (serverId === 'prod' ? 'prod' : 'devel') + 'hal9';

  const infoResp = await fetch(pipelineInfo, {
  });

  const infoData = await infoResp.json();

  const filename = infoData.filename;
  const downloadUrl = `https://${s3Name}.s3.us-west-2.amazonaws.com/pipeline/${filename}.pln`;

  const pipelineResp = await fetch(downloadUrl, {
  });

  return JSON.parse(await pipelineResp.json());
}

function NativeAPI(options) {
  const me = this;
  me.options = options;

  Object.assign(this, internal);

  Object.assign(this, {
    create: create,
    step: step,
    load: load,
    fetch: fetchPipeline,
    run: run,
  });
}

export const init = (options) => {
  options = options ? options : {};

  const api = new NativeAPI(options);

  if (options.makeglobal === true) {
    // used when initializing iframe which does not support returning callbacks
    window.hal9 = options.api ?? api;
    return;
  }
  
  return api;
}

export default init();
