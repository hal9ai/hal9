import { init } from '../api/api'
import { launchDesigner } from './launcher'
import { backend } from '../core/backend/backend'

const Designer = function(hostopt) {
  let pid = undefined;
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

  async function serverSave(raw, hostopt) {
    if (!hostopt.designer.persist) return;
    
    return await fetch(hostopt.designer.persist, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: raw
    });
  }

  async function onRequestSave() {
    const saveText = await hal9api.exportto.getSaveText(pid, undefined, ['state']);
    await serverSave(saveText, hostopt);
  }

  function showInitializationError(error) {
    const initErr = document.createElement('div');
    initErr.style.position = 'absolute';
    initErr.style.zIndex = 10000;
    initErr.style.width = '100%';
    initErr.style.height = '100%';
    initErr.style.background = '#FFF';
    initErr.style.overflow = 'hidden';
    initErr.style.lineHeight = '30px';
    initErr.style.textIndent = '6px';
    initErr.innerText = error;
    initErr.onclick = function() { initErr.remove(); }
    document.body.insertBefore(initErr, document.body.firstChild);
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

    const backendinst = backend(hostopt);

    const options = {
      iframe: true,
      html: app,
      api: hostopt.api,
      editable: hostopt.mode == 'run',
      mode: hostopt.mode,
      pipeline: pipeline,
      manifest: backendinst.manifest(),
      events: Object.assign(
        {
          onRequestSave: onRequestSave,
        },
        backendinst.events()
      ),
      env: hostopt.env,
      debug: debug,
    };

    hal9api = await init(options, {});
    backendinst.setapi(hal9api);

    pid = await hal9api.load(pipeline);
    backendinst.setpid(pid);
    
    try {
      await hal9api.run(pid, {
        iframe: true,
        html: 'output',
        shadow: false
      });
    } catch(e) {
      // API might fail to run if there are errors in the pipeline
      console.error(e);
    }

    try {
      await backendinst.init(pid);
    }
    catch(e) {
      showInitializationError(e.toString());
      throw e;
    }

    if (hostopt.runtime) {
      try {
        await backendinst.addRuntime({
          name: hostopt.runtime.name,
          implementation: hostopt.runtime.implementation,
          platform: hostopt.runtime.platform,
          script: hostopt.runtime.script
        });
      }
      catch(e) {
        showInitializationError(e.toString());
        throw e;
      }
    }

    if (hostopt.mode == 'design') {
      await launchDesigner(hal9api, Object.assign({
        version: hostopt.designer.version
      }, options), pid, backendinst);
    }
  }
}

export const designer = function(hostopt) {
  return new Designer(hostopt);
}
