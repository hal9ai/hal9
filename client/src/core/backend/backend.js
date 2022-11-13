import clone from '../utils/clone';
import * as browser from './implementations/browser';
import * as server from './implementations/server';
import { Dependencies } from './dependencies';
import * as pipelines from '../pipelines';

const Backend = function(hostopt) {
  let pid = undefined;
  let pidchanged = undefined;

  let dependencies = undefined;
  let manifest = {};
  
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

    const steps = await pipelines.getStepsWithHeaders(pid);

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
      await pipelines.runStep(pid, sid, {
        manifest: stepManifest,
        html: 'hal9-step-' + sid
      });
    }
  }

  async function initializeManifest() {
    const steps = await pipelines.getStepsWithHeaders(pid);
    const ids = steps.map(e => e.id);

    // const ids = await dependencies.getInitial(pid);
    
    await performUpdates(ids);
  }

  function onStart() {
  }

  function onEnd(result, steps) {
  }

  async function onChange(changes) {
    if (changes.step === undefined) return;

    let id = changes.step.id;

    const ids = await dependencies.getForward(pid, changes.step.id);
    ids.unshift(id);
    await performUpdates(ids);
  }

  

  async function onEvent(step, event, params) {
    manifest[step.id] = manifest[step.id] ?? {};
    params = params ?? {};

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

    const ids = await dependencies.getForward(pid, step.id);
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

  function events() {
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

  this.onpid = function(callback) {
    pidchanged = callback;
  }

  this.getpid = function() {
    return pid;
  }

  this.init = async function(pipelineid) {
    pid = pipelineid;
    if (pidchanged) {
      pidchanged(pid);
    }

    pipelines.setPipelineContext(pid, {
      events: events(),
      manifest: manifest,
    });

    await initializeManifest();
  }

  this.getfile = async function(path) {
    await ensureServerUrls();
    if (!serverurls.getfile) return undefined;
    if (typeof(serverurls.getfile) == 'function') return await serverurls.getfile(path);

    const resp = await fetch(serverurls.getfile, {
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
    await ensureServerUrls();
    if (typeof(serverurls.putfile) == 'function') return await serverurls.putfile(path, contents);

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

    for (let filePath of Object.keys(spec.files)) {
      await this.putFile(spec.name, filePath, spec.files[filePath]);
    }

    await this.onUpdated();
  }

  let terminals = [];
  this.initTerminal = async function(runtime, options) {
    const implementation = runtimeToImplementation(runtime);
    try {
      if (implementations[implementation].initTerminal) {
        const tid = terminals.length;
        terminals[tid] = await implementations[implementation].initTerminal(runtime, options);
        return tid;
      } else {
        return null;
      }
    }
    catch (e) {
      if (hostopt.events && hostopt.events.onError) hostopt.events.onError(e.toString());
      else throw e;
    }
  }

  this.termRead = async function(tid, ondata) {
    terminals[tid].read(ondata);
  }

  this.termWrite = async function(tid, input) {
    terminals[tid].write(input);
  }

  this.attachError = function(error) {
    if (!hostopt.events) hostopt.events = {};
    hostopt.events.onError = error;
  }

  function initialize() {
    dependencies = new Dependencies();
  }

  initialize();
}

let backends = [];

export const backend = function(hostopt) {
  const bid = backends.length;
  backends[bid] = new Backend(hostopt);
  return bid;
}

export const getpid = function(bid) {
  return backends[bid].getpid();
}

export const init = async function(bid, pipelineid) {
  return await backends[bid].init(pipelineid);
}

export const getfile = async function(bid, path) {
  return await backends[bid].getfile(path);
}

export const putFile = async function(bid, runtime, path, contents) {
  return await backends[bid].putFile(runtime, path, contents);
}

export const onUpdated = async function(bid) {
  return await backends[bid].onUpdated();
}

export const addRuntime = async function(bid, spec) {
  return await backends[bid].addRuntime(spec);
}

export const initTerminal = async function(bid, runtime, options) {
  return await backends[bid].initTerminal(runtime, options);
}

export const termRead = async function(bid, tid, ondata) {
  return await backends[bid].termRead(tid, ondata);
}

export const termWrite = async function(bid, tid, input) {
  return await backends[bid].termWrite(tid, input);
}

export const attachError = function(bid, error) {
  return backends[bid].attachError(error);
}

export const onpid = function(bid, callback) {
  return backends[bid].onpid(callback);
}
