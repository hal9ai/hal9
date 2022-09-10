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

    const resp = await fetch(hostopt.designer.eval, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

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

  async function performUpdates(names) {
    if (names.length == 0) return;

    const steps = await hal9api.pipelines.getStepsWithHeaders(pid);

    let calls = [];
    for (let name of names) {
      let step = steps.filter(x => x.name == name);
      if (step.length != 1) continue;
      step = step[0];

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

      manifest[call['fn_name']] = call.result;

      await hal9api.pipelines.runStep(pid, step.id, { html: 'hal9-step-' + step.id });
    }
  }

  async function initializeManifest(pid) {
    const steps = await hal9api.pipelines.getStepsWithHeaders(pid);
    const names = steps.map(e => e.name);
    await performUpdates(names);
  }

  function onStart() {
  }

  function onEnd(result, steps) {
  }

  async function onChange(changes) {
    if (changes.step !== undefined || changes.stepid !== undefined) {
      let name = '';
      if (changes.stepid !== undefined)
        name = (await hal9api.pipelines.getStep(pid, changes.stepid)).name;
      else
        name = changes.step.name;

      const deps = await getForwardDependencies(changes.step.name);
      deps.push(name);
      await performUpdates(deps);
    }
  }

  async function onRequestSave() {
    const saveText = await hal9api.exportto.getSaveText(pid, undefined, ['state']);
    await serverSave(saveText, hostopt);
  }

  async function getForwardDependencies(source) {
    // TODO: Actually use the deps graph.
    const steps = await hal9api.pipelines.getStepsWithHeaders(pid);
    const deps = steps.map(e => e.name).filter(e => e != source);
    return deps;
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

    const deps = await getForwardDependencies(step.name);
    await performUpdates(deps);
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
    await initializeManifest(pid);

    if (hostopt.mode == 'design') {
      await launchDesigner(hal9api, options, pid);
    } else {
      await hal9api.run(pid, {
        iframe: true,
        html: 'output',
        shadow: false
      });
    }
  }
}

export const designer = function(hostopt) {
  return new Designer(hostopt);
}
