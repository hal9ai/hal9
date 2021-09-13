import * as workers from './workers'
import * as environment from './utils/environment'

export const runPipelineRemote = async (pipelineid) => {
  var workerUrl = await workers.getValidWorkerUrl();
  const pipelineurl = environment.getServerUrl() + '/?sharedPipeline=' + pipelineid;

  var res = await fetch(workerUrl + '/execute', {
    method: 'POST',
    body: JSON.stringify({ operation: 'pipeline', pipelineurl: pipelineurl }),
    headers: { 'Content-Type': 'application/json' }
  });

  if (!res.ok) {
    var details = res.statusText;
    try {
      details = await res.json();
    }
    catch (e) {}

    details = typeof(details) === 'string' ? details : JSON.stringify(details);
    throw 'Failed to execute pipeline on remote worker: ' + details;
  }
  return await res.json();
}
