
const ServerImplementation = function(hostopt) {
  let backendquery = '';
  let serverurls = hostopt.designer;

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

  async function initBackend() {
    if (!serverurls.init) return;

    let backendid = crypto.getRandomValues(new Uint32Array(2)).join('-');
    backendquery = '?' + new URLSearchParams({
      backendid: backendid
    });

    try {
      const resp = await fetch(serverurls.init + backendquery);

      if (!resp.ok) {
        console.error('Failed to initialize backend: ' + (await resp.text()));
      }

      initHeartbeat();
    }
    catch(e) {
      console.error('Failed to receive response for backend initialization: ' + e.toString());
    }
  }

  this.process = async function() {
    console.log('Sending: \n' + JSON.stringify(body, null, 2));

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

    if (!resp.ok) {
      throw('Server /' + serverurls.eval + ' failed with ' + resp.statusText + ': [' + (await resp.text()) + ']')
    }

    const updates = await resp.json();

    console.log('Receiving: \n' + JSON.stringify(updates, null, 2));
  }

  this.addRuntime = async function(spec) {
    if (hostopt.serverurls) serverurls = await hostopt.serverurls();
    await initBackend();
    return spec;
  }
}

export const create = function(hostopt) {
  return new ServerImplementation(hostopt);
}