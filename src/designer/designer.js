import { init } from '../api/api'
import { launchDesigner } from './launcher'

const Designer = function(hostopt) {
  let pid = undefined;
  let manifest = {};
  let hal9api = undefined;

  let pipeline = {
    "steps": [],
    "params": {},
    "outputs": {},
    "scripts": {},
    "version": "0.0.1"
  }

  const debug = hostopt.debug;

  const app = document.getElementById(hostopt.hostel)

  async function serverEval(body) {
    if (typeof(hostopt.designer.eval) === 'function') {
      return await hostopt.designer.eval(body);
    }

    console.log('Sending: \n' + JSON.stringify(body, null, 2));

    let resp;
    try {
      resp = await fetch(hostopt.designer.eval, {
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
      return await fetch(hostopt.designer.persist, {
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

  async function initializeManifest(pid) {
    const steps = await hal9api.pipelines.getStepsWithHeaders(pid);
    const ids = steps.map(e => e.ids);
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

  async function onRequestSave() {
    const saveText = await hal9api.exportto.getSaveText(pid, undefined, ['state']);
    await serverSave(saveText, hostopt);
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

  this.init = async function() {
    if (typeof(hostopt.designer.restore) === 'function') {
      pipeline = await hostopt.designer.restore();
    }
    else if (hostopt.designer.persist) {
      var resp = await fetch(hostopt.designer.persist)
      if (resp.ok) {
        pipeline = await resp.json()
      }
    }

    if (hostopt.designer.heartbeat) {
      const heartbeatms = hostopt.designer.heartbeatms ?? 60 * 1000;
      const sendhb = async function() {
        let resp;
        try {
          resp = await fetch(hostopt.designer.heartbeat);
        }
        catch(e) {
          console.error('Failed to receive response for heartbeat: ' + e.toString());
        }
        if (resp.ok) {
          console.error('Failed to register heartbeat: ' + (await resp.text()));
        }
      }
      sendhb();
      setInterval(sendhb, heartbeatms);
    }

    const options = {
      iframe: true,
      html: app,
      api: hostopt.api,
      editable: hostopt.mode == 'run',
      mode: hostopt.mode,
      pipeline: pipeline,
      manifest: manifest,
      events: {
        /* pipeline events */
        onStart: onStart,
        onEnd: onEnd,
        onInvalidate: onInvalidate,
        onError: onError,
        /* runtime events */
        onEvent: onEvent,
        /* designer events */
        onChange: onChange,
        onRequestSave: onRequestSave,
      },
      env: hostopt.env,
      debug: debug
    };

    hal9api = await init(options, {});

    pid = await hal9api.load(pipeline);

    await hal9api.run(pid, {
      iframe: true,
      html: 'output',
      shadow: false
    });

    try {
      await initializeManifest(pid);
    }
    catch(e) {
      const initErr = document.createElement('div');
      initErr.style.position = 'absolute';
      initErr.style.zIndex = 10000;
      initErr.style.width = '100%';
      initErr.style.background = '#FFF';
      initErr.style.height = '30px';
      initErr.style.overflow = 'hidden';
      initErr.style.lineHeight = '30px';
      initErr.style.textIndent = '6px';
      initErr.innerText = e.toString();
      initErr.onclick = function() { initErr.remove(); }
      document.body.insertBefore(initErr, document.body.firstChild);
    }

    if (hostopt.mode == 'design') {
      await launchDesigner(hal9api, options, pid);
    }
  }
}

export const designer = function(hostopt) {
  return new Designer(hostopt);
}
