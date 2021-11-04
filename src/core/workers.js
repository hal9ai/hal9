import * as environment from './utils/environment';
import compareVersions from 'compare-versions';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const preflight = async function(workerUrl, headers) {
  return await fetch(workerUrl + '/execute', {
    method: 'POST',
    body: JSON.stringify({ operation: 'preflight' }),
    headers: Object.assign({ 'Content-Type': 'application/json' }, headers)
  });
}

const serverInfo = async function(headers) {
  const serverUrl = environment.getServerUrl();
  var res = await fetch(serverUrl + '/api/info', {
    method: 'GET',
    headers: headers
  });

  return res.json();
}

const getWorkerUrl = async (pipelinename, headers) => {
  
  const workerListArguments = !pipelinename ? '' : '?p=' + pipelinename;
  const workersListUrl = environment.getServerUrl() + '/api/workers' + workerListArguments;

  var res = await fetch(workersListUrl, {
    headers: headers
  });

  if (!res.ok) {
    var json = null;
    try {
      json = await res.json();
    }
    catch(e) {}
    throw json ? json : 'Failed to retrieve worker list: ' + res.statusText;
    return;
  }

  const workers = await res.json();
  const urls = Object.keys(workers);
  const workerUrl = urls[urls.length - 1];

  return workerUrl;
}

export const getValidWorkerUrl = async function(pipelinename, headers) {
  var workerUrl = null;
  var shouldRetry = true;
  var retryCount = 5;
  var details = 'The Hal9 worker is unavailable, give us a minute to recover.';

  while (shouldRetry && retryCount > 0) {
    let sleepDuration = 5000;

    try {
      workerUrl = await getWorkerUrl(pipelinename, headers);
    } catch (error) {
      details = error;
      console.log(details);
      sleepDuration = 5000;
    }

    // get server version
    const info = await serverInfo(headers);
    if (compareVersions(info.version, '0.0.142') < 0) {
      return workerUrl;
    }

    var res = await preflight(workerUrl, headers);
    if (res.status == 503) {
      let message = null;
      try {
        message = await res.text();
      } catch (error) {
      }
      if (message != null) {
        if (message == "worker") {
          sleepDuration = 5000;
          details = 'Gave up waiting for worker to start.';
          console.log(details);
        } else if (message == "instance") {
          sleepDuration = 40000;
          details = 'Gave up waiting for instance to start';
          console.log(details);
        } else {
          // unknown information from server
          // log something or let us know.
          break;
        }
      } else {
        // or use break
        shouldRetry = false;
      }
    } else if (res.status == 500) {
      // if the worker breaks or is just not there and we have not started restarting it,
      // we should also wait for the restart to trigger
      sleepDuration = 3000;
      details = 'Failed to get valid worker.';
      console.log(details);
    } else {
      // or use break
      shouldRetry = false;
    }

    if (shouldRetry) {
      await sleep(sleepDuration);
    }

    retryCount--;
  }

  if (workerUrl == null) {
    console.log('Gave up on preflight: ' + details);
    throw details;
  }

  return workerUrl;
}
