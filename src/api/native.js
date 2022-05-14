import * as environment from '../core/utils/environment';
import * as workers from '../core/workers';
import * as pipelines from '../core/pipelines';
import * as pipelineremote from '../core/pipelineremote';
import * as datasets from '../core/datasets';
import * as screenshot from '../core/utils/screenshot';

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

export const runPipeline = async (pipelineid, context) => {
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
  if (!url && params.script) {
    return {
      id: maxStepId++,
      inlineScript: params.script,
      inlineScriptLanguage: params.language ?? 'javascript',
      html: output
    }
  }

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
  let s3Name = (serverId == 'dev' ? 'devel' : serverId) + 'hal9';

  const infoResp = await fetch(pipelineInfo, {
  });

  const infoData = await infoResp.json();

  const filename = infoData.filename;
  const downloadUrl = `https://${s3Name}.s3.us-west-2.amazonaws.com/pipeline/${filename}.pln`;

  const pipelineResp = await fetch(downloadUrl, {
  });

  return JSON.parse(await pipelineResp.json());
}

export async function setEnv(env) {
}

export async function datasetsSave(dataurl) {
  return datasets.save(dataurl);
}

export async function pipelinesCreate(steps) {
  return await pipelines.create(steps);
}

export async function pipelinesUpdate(pipelineid, steps) {
  return await pipelines.update(pipelineid, steps);
}

export async function pipelinesRemove(pipelineid) {
  return await pipelines.remove(pipelineid);
}

export async function pipelinesRunStep(pipelineid, sid, context, partial) {
  return await pipelines.runStep(pipelineid, sid, context, partial);
}

export async function pipelinesRun(pipelineid, context, partial, stepstopid) {
  return await pipelines.run(pipelineid, context, partial, stepstopid);
}

export async function pipelinesGetError(pipelineid) {
  return await pipelines.getError(pipelineid);
}

export async function pipelinesGetParams(pipelineid, sid) {
  return await pipelines.getParams(pipelineid, sid);
}

export async function pipelinesSetParams(pipelineid, sid, params) {
  return await pipelines.setParams(pipelineid, sid, params);
}

export async function pipelinesMergeParams(pipelineid, sid, params) {
  return await pipelines.mergeParams(pipelineid, sid, params);
}

export async function pipelinesGetSteps(pipelineid) {
  return await pipelines.getSteps(pipelineid);
}

export async function pipelinesUpdateStep(pipelineid, step) {
  return await pipelines.updateStep(pipelineid, step);
}

export async function pipelinesAddStep(pipelineid, step) {
  return await pipelines.addStep(pipelineid, step);
}

export async function pipelinesRemoveStep(pipelineid, step) {
  return await pipelines.removeStep(pipelineid, step);
}

export async function pipelinesMoveStep(pipelineid, stepid, change) {
  return await pipelines.moveStep(pipelineid, stepid, change);
}

export async function pipelinesGetNested(pipelineid) {
  return await pipelines.getNested(pipelineid);
}

export async function pipelinesGetStep(pipelineid, sid) {
  return await pipelines.getStep(pipelineid, sid);
}

export async function pipelinesGetSources(pipelineid, sid) {
  return await pipelines.getSources(pipelineid, sid);
}

export async function pipelinesGetStepError(pipelineid, sid) {
  return await pipelines.getStepError(pipelineid, sid);
}

export async function pipelinesSetScript(pipelineid, sid, script) {
  return await pipelines.setScript(pipelineid, sid, script);
}

export async function pipelinesGetScript(pipelineid, sid) {
  return await pipelines.getScript(pipelineid, sid);
}

export async function pipelinesGetHashable(pipelineid) {
  return await pipelines.getHashable(pipelineid);
}

export async function pipelinesGetSaveText(pipelineid, padding) {
  return await pipelines.getSaveText(pipelineid, padding);
}

export async function pipelinesLoad(pipeline) {
  return await pipelines.load(pipeline);
}

export async function pipelinesGetMaxId(pipelineid) {
  return await pipelines.getMaxId(pipelineid);
}

export async function pipelinesGetGlobal(pipelineid, name) {
  return await pipelines.getGlobal(pipelineid, name);
}

export async function pipelinesSetGlobal(pipelineid, name, data) {
  return await pipelines.setGlobal(pipelineid, name, data);
}

export async function pipelinesGetGlobalNames(pipelineid) {
  return await pipelines.getGlobalNames(pipelineid);
}

export async function pipelinesGetGlobals(pipelineid) {
  return await pipelines.getGlobals(pipelineid);
}

export async function pipelinesInvalidateStep(pipelineid, sid) {
  return await pipelines.invalidateStep(pipelineid, sid);
}

export async function pipelinesGetHtml(pipelineid) {
  return await pipelines.getHtml(pipelineid);
}

export async function pipelinesGetHtmlRemote(pipelinepath) {
  return await pipelines.getHtmlRemote(pipelinepath);
}

export async function pipelinesUpdateMetadata(pipelineid, metadata) {
  return await pipelines.updateMetadata(pipelineid, metadata);
}

export async function pipelinesGetMetadata(pipelineid) {
  return await pipelines.getMetadata(pipelineid);
}

export async function pipelinesAbort(pipelineid) {
  return await pipelines.abort(pipelineid);
}

export async function pipelinesIsAborted(pipelineid) {
  return await pipelines.isAborted(pipelineid);
}

export async function screenshotCapture(output, options = {}) {
  return await screenshot.capture(output, options);
}

export async function screenshotResize(sourceImageData, width, height) {
  return await screenshot.resize(sourceImageData, width, height);
}

export function htmlSetContainerStyle(name, value) {
  
}
