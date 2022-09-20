const Backend = function(hostopt) {
  let pid = undefined;
  let manifest = {};
  let hal9api = undefined;
  let backendid = undefined;
  let backendquery = '';

  async function serverEval(body) {
    if (typeof(hostopt.designer.eval) === 'function') {
      return await hostopt.designer.eval(body);
    }

    console.log('Sending: \n' + JSON.stringify(body, null, 2));

    let resp;
    try {
      resp = await fetch(hostopt.designer.eval + backendquery, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
    }
    catch (e) {
      throw('Server /' + hostopt.designer.eval + ' failed: [' + e.toString() + ']')
    }

    if (!resp.ok) {
      throw('Server /' + hostopt.designer.eval + ' failed with ' + resp.statusText + ': [' + (await resp.text()) + ']')
    }

    const updates = await resp.json();

    console.log('Receiving: \n' + JSON.stringify(updates, null, 2));

    return updates;
  }

  async function serverSave(raw, hostopt) {
    if (!hostopt.designer.persist) return;
    if (typeof(hostopt.designer.persist) === 'function')
      return await hostopt.designer.persist(raw);
    else {
      return await fetch(hostopt.designer.persist + backendquery, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: raw
      });
    }
  }

  async function performUpdates(ids) {
    if (ids.length == 0) return;

    const steps = await hal9api.pipelines.getStepsWithHeaders(pid);

    let calls = [];
    for (let id of ids) {
      let step = steps.filter(x => x.id == id);
      if (step.length != 1) continue;
      step = step[0];

      let name = step.name;

      for (let param of Object.keys(step.params)) {
        calls.push({
          node: name,
          fn_name: param,
          args: []
        });
      }

      for (let input of step.header.input) {
        calls.push({
          node: name,
          fn_name: input,
          args: []
        });
      }
    }

    const updates = await serverEval({ manifests: [
      {
        runtime: hostopt.designer.runtime ?? 'r',
        calls: calls
      }
    ]});

    if (!updates.responses || updates.responses.length == 0 || !updates.responses[0].calls) return;
    calls = updates.responses[0].calls;

    for (let call of calls) {
      const candidates = steps.filter(e => e.name == call.node);
      if (candidates.length == 0) continue;
      const step = candidates[0];

      manifest[step.id] = manifest[step.id] ?? {};

      if (call.result === null || call.result === undefined) continue;
      manifest[step.id][call['fn_name']] = call.result;

      await hal9api.pipelines.runStep(pid, step.id, { html: 'hal9-step-' + step.id });
    }
  }

  async function initializeManifest() {
    const steps = await hal9api.pipelines.getStepsWithHeaders(pid);
    const ids = steps.map(e => e.id);
    await performUpdates(ids);
  }

  function onStart() {
  }

  function onEnd(result, steps) {
  }

  async function onChange(changes) {
    if (changes.step !== undefined) {
      let id = changes.step.id;

      const ids = await getForwardDependencies(changes.step.id);
      ids.unshift(id);
      await performUpdates(ids);
    }
  }

  async function getForwardDependencies(sid) {
    const steps = await hal9api.pipelines.getStepsWithHeaders(pid);
    const deps = await hal9api.pipelines.getDependencies(pid);

    if (!deps || Object.keys(deps).length == 0) {
      const allids = steps.filter(e => e.id != sid).map(e => e.id);
      return allids
    }

    const forward = {};
    for (let dep of Object.keys(deps)) {
      let backwards = deps[dep];
      for (let backward of backwards) {
        if (!forward[backward]) forward[backward] = [];
        if (!forward[backward].includes(dep)) forward[backward].push(dep);
      }
    }

    let toadd = forward[sid] ?? [];
    let added = {};

    let maxdeps = 10000;
    while (toadd.length > 0) {
      if (maxdeps-- <= 0) throw('Recursive dependency or too many dependencies');

      const el = toadd.shift();
      added[el] = true;

      if (forward[el]) {
        toadd = toadd.concat(forward[el]);
      }
    }

    return Object.keys(added).map(function(e) { return parseInt(e) });
  }

  async function onEvent(step, event, params) {
    var call = {
      'node': step.name,
      'fn_name': event,
      'args': Object.keys(params).map(function(name) {
        return {
          name: name,
          value: params[name]
        };
      })
    };

    await serverEval({ manifests: [
      {
        runtime: hostopt.designer.runtime ?? 'r',
        calls: [ call ]
      }
    ]});

    const ids = await getForwardDependencies(step.id);
    await performUpdates(ids);
  }

  function onInvalidate(step) {
  }

  function onError(error) {
    if (error) console.error(error);
  }

  function hashCode(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      var char = str.charCodeAt(i);
      hash = ((hash<<5)-hash)+char;
      hash = hash & hash;
    }
    return hash;
  }

  async function initBackend() {
    if (!hostopt.designer.init) return;

    backendid = crypto.getRandomValues(new Uint32Array(2)).join('-');
    backendquery = '?' + new URLSearchParams({
      backendid: backendid
    });

    try {
      const resp = await fetch(hostopt.designer.init + backendquery);

      if (!resp.ok) {
        console.error('Failed to initialize backend: ' + (await resp.text()));
      }
    }
    catch(e) {
      console.error('Failed to receive response for backend initialization: ' + e.toString());
    }
  }

  async function initHeartbeat() {
    if (!hostopt.designer.heartbeat) return;

    const heartbeatms = hostopt.designer.heartbeatms ?? 60 * 1000;
    const sendhb = async function() {
      try {
        const resp = await fetch(hostopt.designer.heartbeat + backendquery);
        if (!resp.ok) {
          console.error('Failed to register heartbeat: ' + (await resp.text()));
        }
      }
      catch(e) {
        console.error('Failed to receive response for heartbeat: ' + e.toString());
      }
    }
    sendhb();
    setInterval(sendhb, heartbeatms);
  }

  this.manifest = function() {
    return manifest;
  }

  this.events = function() {
    return {
      /* pipeline events */
      onStart: onStart,
      onEnd: onEnd,
      onInvalidate: onInvalidate,
      onError: onError,
      /* runtime events */
      onEvent: onEvent,
      /* designer events */
      onChange: onChange,
    }
  }

  this.connect = async function(h9api) {
    hal9api = h9api;

    await initBackend();
    initHeartbeat();
  }

  this.init = async function(pipelineid) {
    pid = pipelineid;
    await initializeManifest();
  }

  this.isinit = function() {
    return !!pid;
  }

  this.pipeline = async function() {
    if (!hostopt.designer.pipeline) return undefined;

    const resp = await fetch(hostopt.designer.pipeline + backendquery);
    if (!resp.ok) {
      console.error('Failed to retrieve pipeline: ' + (await resp.text()));
    }

    return await resp.json();
  }

  this.getfile = async function(path) {
    if (!hostopt.designer.getfile) return undefined;

    const resp = await fetch(hostopt.designer.getfile + backendquery, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        path: path
      })
    });
    if (!resp.ok) {
      console.error('Failed to retrive file: ' + (await resp.text()));
      return;
    }

    return await resp.text();
  }

  this.putfile = async function(path, contents) {
    if (!hostopt.designer.putfile) return undefined;

    const resp = await fetch(hostopt.designer.putfile + backendquery, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        path: path,
        contents: contents
      })
    });
    if (!resp.ok) {
      console.error('Failed to update file: ' + (await resp.text()));
      return;
    }

    return await resp.json();
  }

  this.onUpdated = async function() {
    await initializeManifest();
  }
}

export const backend = function(hostopt, hal9api) {
  return new Backend(hostopt, hal9api);
}
