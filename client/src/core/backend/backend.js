import clone from '../utils/clone';
import * as browser from './implementations/browser';
import * as server from './implementations/server';

const Backend = function(hostopt) {
  let pid = undefined;
  let pidchanged = undefined;

  let manifest = {};
  let hal9api = window.hal9;
  let defaultRuntime = hostopt.runtime;
  let serverurls = hostopt.designer;

  let implementations = {
    browser: browser.create(hostopt),
    server: server.create(hostopt),
  }

  let platformToImplementations = {
    r: 'server',
    python: 'server',
    js: 'browser'
  };

  let runtimes = {};

  function runtimeToImplementation(runtime) {
    return platformToImplementations[runtimes[runtime].platform.toLowerCase()]
  }

  async function implementationEval(body) {
    
    const evalImplements = {};
    body.manifests.map(e => {
      const implementation = runtimeToImplementation(e.runtime);
      evalImplements[implementation] = true;
    });

    let responses = [];
    for (let name of Object.keys(evalImplements)) {
      let implementation = implementations[name];
      if (!implementation) throw('Invalid implementation ' + name);

      let manifests = body.manifests.filter(e => {
        const implementation = runtimeToImplementation(e.runtime);
        return implementation === name;
      });

      const response = await implementation.process({
        manifests: manifests
      });

      responses = responses.concat(response.responses);
    }

    for (let response of responses) {
      for (let call of response.calls) {
        if (call.error) {
          if (hostopt.events && hostopt.events.onError) hostopt.events.onError(call.error);
          else throw(call.error)
        }
      }
    }

    return {
      responses: responses
    };
  }

  async function performUpdates(ids) {
    if (ids.length == 0) return;
    if (Object.keys(runtimes).length == 0) return;

    const steps = await hal9api.pipelines.getStepsWithHeaders(pid);

    let runtimeCalls = {};

    for (let id of ids) {
      let step = steps.filter(x => x.id == id);
      if (step.length != 1) continue;
      step = step[0];

      let name = step.name;
      let runtimeCandidates = step.runtime ? [ step.runtime ] : Object.keys(runtimes);

      for (let runtime of runtimeCandidates) {

        runtimeCalls[runtime] = runtimeCalls[runtime] ?? [];

        for (let param of Object.keys(step.params)) {
          runtimeCalls[runtime].push({
            node: name,
            fn_name: param,
            args: []
          });
        }

        for (let input of step.header.input) {
          runtimeCalls[runtime].push({
            node: name,
            fn_name: input,
            args: []
          });
        }

      }
    }

    const manifests = Object.keys(runtimeCalls).map((runtime) => {
      return {
        runtime: runtime,
        calls: runtimeCalls[runtime]
      }
    })

    const updates = await implementationEval({ manifests: manifests });

    if (!updates.responses || updates.responses.length == 0 || !updates.responses[0].calls) return;
    
    let calls = []
    for (let response of updates.responses) {
      let responseCalls = response.calls.filter(e => e.result !== null || e.error !== undefined);
      calls = calls.concat(responseCalls);
    }

    let stepManifest = {};
    for (let call of calls) {
      const candidates = steps.filter(e => e.name == call.node);
      if (candidates.length == 0) continue;
      const step = candidates[0];

      stepManifest[step.id] = stepManifest[step.id] ?? {};
      manifest[step.id] = manifest[step.id] ?? {};

      if (call.result === null || call.result === undefined) continue;
      manifest[step.id][call['fn_name']] = stepManifest[step.id][call['fn_name']] = call.result;
    }

    for (let sid of Object.keys(stepManifest)) {
      await hal9api.pipelines.runStep(pid, sid, {
        manifest: stepManifest,
        html: 'hal9-step-' + sid
      });
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
    if (changes.step === undefined) return;

    let id = changes.step.id;

    const ids = await getForwardDependencies(changes.step.id);
    ids.unshift(id);
    await performUpdates(ids);
  }

  async function getForwardDependencies(sid) {
    const steps = await hal9api.pipelines.getStepsWithHeaders(pid);
    const deps = await hal9api.pipelines.getDependencies(pid);

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
    manifest[step.id] = manifest[step.id] ?? {};

    var call = {
      'node': step.name,
      'fn_name': event,
      'args': Object.keys(params).map(function(name) {
        manifest[step.id][name] = params[name];

        return {
          name: name,
          value: params[name]
        };
      })
    };

    let runtimeCalls = Object.keys(runtimes).map(function(runtime) {
      return {
        runtime: runtimes[runtime].name,
        calls: [ call ]
      };
    });

    await implementationEval({ manifests: runtimeCalls });

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

  async function ensureServerUrls() {
    if (!serverurls && hostopt.serverurls) serverurls = await hostopt.serverurls();
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

  this.setapi = async function(h9api) {
    hal9api = h9api;
  }

  this.setpid = async function(pipelineid) {
    pid = pipelineid;
    if (pidchanged) pidchanged(pid);
  }

  this.onpid = function(callback) {
    pidchanged = callback;
  }

  this.getpid = function() {
    return pid;
  }

  this.connect = async function(h9api) {
    hal9api = h9api;
  }

  this.init = async function(pipelineid, h9api) {
    pid = pipelineid;
    if (h9api) hal9api = h9api;
    await initializeManifest();
  }

  this.isinit = function() {
    return !!pid;
  }

  this.pipeline = async function() {
    await ensureServerUrls();
    if (!serverurls.pipeline) return undefined;

    const resp = await fetch(serverurls.pipeline + backendquery);
    if (!resp.ok) {
      console.error('Failed to retrieve pipeline: ' + (await resp.text()));
    }

    return await resp.json();
  }

  this.getfile = async function(path) {
    await ensureServerUrls();
    if (!serverurls.getfile) return undefined;

    const resp = await fetch(serverurls.getfile + backendquery, {
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

  this.putFile = async function(runtime, path, contents) {
    const implementation = runtimeToImplementation(runtime);
    try {
      return await implementations[implementation].putFile(runtime, path, contents);
    }
    catch (e) {
      if (hostopt.events && hostopt.events.onError) hostopt.events.onError(e.toString());
      else throw e;
    }
  }

  this.onUpdated = async function() {
    await initializeManifest();
  }

  this.addRuntime = async function(spec) {
    if (!defaultRuntime) defaultRuntime = spec.platform;
    if (!spec.implementation) throw 'The spec requires an implementation';
    
    const impl = implementations[spec.implementation];
    if (!impl) throw('Implementation ' + spec.implementation + ' is not supported')

    await impl.addRuntime(spec);
    runtimes[spec.name] = spec;

    await this.onUpdated();
  }

  this.initTerminal = async function(runtime, options) {
    const implementation = runtimeToImplementation(runtime);
    try {
      if (implementations[implementation].initTerminal)
        return await implementations[implementation].initTerminal(runtime, options);
      else
        return null;
    }
    catch (e) {
      if (hostopt.events && hostopt.events.onError) hostopt.events.onError(e.toString());
      else throw e;
    }
  }

  this.attachError = function(error) {
    if (!hostopt.events) hostopt.events = {};
    hostopt.events.onError = error;
  }
}

export const backend = function(hostopt, hal9api) {
  return new Backend(hostopt, hal9api);
}
