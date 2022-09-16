import { init } from '../api/api'
import { launchDesigner } from './launcher'
import { backend } from './backend'

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

  async function onRequestSave() {
    const saveText = await hal9api.exportto.getSaveText(pid, undefined, ['state']);
    await serverSave(saveText, hostopt);
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
      manifest: manifest,
      events: Object.assign(
        {
          onRequestSave: onRequestSave,
        },
        backendinst.events()
      ),
      env: hostopt.env,
      debug: debug
    };

    hal9api = await init(options, {});

    pid = await hal9api.load(pipeline);
    
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
      await backendinst.init(pid, hal9api);
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
