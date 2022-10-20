
const ServerImplementation = function(hostopt) {
  let backendquery = '';
  let serverurls = hostopt.designer;

  let terminalid = undefined;
  let terminalOnData = undefined;

  async function initHeartbeat() {
    if (!serverurls.heartbeat) return;

    const heartbeatms = serverurls.heartbeatms ?? 60 * 1000;
    const sendhb = async function() {
      try {
        const resp = await fetch(serverurls.heartbeat + backendquery);
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

  async function initBackend(spec) {
    if (!serverurls.init) return;

    let backendid = crypto.getRandomValues(new Uint32Array(2)).join('-');
    backendquery = '?' + new URLSearchParams({
      backendid: backendid,
      platform: spec.platform
    });

    try {
      let retries = 10;
      let resp;

      while (retries-- > 0) {
        resp = await fetch(serverurls.init + backendquery);

        if (resp.status == 1000) {
          await new Promise((a) => setTimeout(a, 250))
        }

        if (resp.ok) break;
      }

      if (!resp.ok) {
        const error = 'Failed to initialize backend: ' + (await resp.text());
        console.error(error);
        throw error;
      }
    }
    catch(e) {
      const error = 'Failed to receive response for backend initialization: ' + e.toString();
      console.error(error);
      throw error;
    }
  }

  async function processOne(body) {
    let resp;
    try {
      resp = await fetch(serverurls.eval + backendquery, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
    }
    catch (e) {
      throw('Server /' + serverurls.eval + ' failed: [' + e.toString() + ']')
    }

    return resp;
  }

  this.process = async function(body) {
    console.log('Sending: \n' + JSON.stringify(body, null, 2));

    let retries = 8;
    let resp;

    while (retries-- > 0) {
      resp = await processOne(body)

      if (resp.status == 500) {
        await new Promise((a) => setTimeout(a, 250))
      }

      if (resp.ok) break;
    }

    if (!resp.ok) {
      throw('Server /' + serverurls.eval + ' failed with ' + resp.statusText + ': [' + (await resp.text()) + ']')
    }

    const updates = await resp.json();

    console.log('Receiving: \n' + JSON.stringify(updates, null, 2));

    return updates;
  }

  this.addRuntime = async function(spec) {
    if (hostopt.serverurls) serverurls = await hostopt.serverurls();
    await initBackend(spec);
    initHeartbeat();
    return spec;
  }

  this.putFile = async function(runtime, path, contents) {
    if (!serverurls.putfile ) return;

    const resp = await fetch(serverurls.putfile + backendquery, {
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

  this.initTerminal = async function(runtime) {
    if (!serverurls.terminit) return null;

    const resp = await fetch(serverurls.terminit, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    if (!resp.ok) {
      throw 'Failed to initialize terminal: ' + resp.statusText;
    }

    const json = await resp.json();
    terminalid = json.terminalid;

    const updateTerminal = async function() {
      const resp = await fetch(serverurls.termread + "?terminalid=" + terminalid, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      const json = await resp.json();
      terminalOnData(json.output);
    }
    setTimeout(updateTerminal, 1000);

    return {
      read: (ondata) => terminalOnData = ondata,
      write: async function(input) {
        const resp = await fetch(serverurls.termwrite + "?terminalid=" + terminalid, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            input: input
          })
        });
        if (!resp.ok) {
          console.log('Failed to send console command: ' + ok.statusText);
          return;
        }

        const json = await resp.json();

        setTimeout(updateTerminal, 100);
        setTimeout(updateTerminal, 1000);
      },
    }
  }
}

export const create = function(hostopt) {
  return new ServerImplementation(hostopt);
}