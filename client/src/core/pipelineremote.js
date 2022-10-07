import * as workers from './workers'
import * as environment from './utils/environment'

export const runPipelineRemote = async (pipelinename) => {
  var workerUrl = await workers.getValidWorkerUrl(pipelinename);
  const pipelineurl = environment.getServerUrl() + '/?sharedPipeline=' + pipelinename;

  var res = await fetch(workerUrl + '/execute/pipeline', {
    method: 'POST',
    body: JSON.stringify({ pipelineurl: pipelineurl }),
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
