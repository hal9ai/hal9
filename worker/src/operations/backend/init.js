import * as hal9 from 'hal9';
import * as net from 'net';
import * as sessionmanager from './sessionmanager';

import { log } from '../../logger';
import { spawn } from 'child_process';

function getFreePort() {
  return new Promise(function(accept, reject) {
    var server = net.createServer();

    server.on('error', function(err) {
      server.close();
      reject();
    });

    server.listen(0, function() {
      var port = server.address().port;

      server.close();

      if (!port) {
        reject('Unable to get port');
      } else {
        accept(port);
      }
    });
  });
}

function monitorSpawned(spawned, accept, reject, resolvems) {
  let stdout = '';

  spawned.stdout.on('data', (data) => {
    log.info('/execute/ backend:init data: ' + data.toString().substr(0, 512));
  });

  spawned.stderr.on('data', (data) => {
    stdout = stdout + data;
    log.info('/execute/ backend:init error: ' + data.toString());
  });

  spawned.on('close', (code) => {
  });

  spawned.on('error', (err) => {
    log.info('/execute/ backend:init error: ' + err.toString());
    reject(stdout + ' ' + err.toString())
  });

  spawned.on('exit', (code, signal) => {
    if (code != 0 || signal) {
      if (code) stdout = stdout + 'Code: ' + code;
      if (signal) stdout = stdout + 'Signal: ' + signal;
      reject(stdout)
    }
    else {
      accept()
    }
  });

  if (resolvems > 0) {
    setTimeout(function() {
      accept();
    }, resolvems);
  }
}

function createNewApp(path, platform) {
  return new Promise((accept, reject) => {
    log.info('/execute/ backend:init running: hal9 new ' + path);
    const spawned = spawn('./hal9', [ '--platform', platform, 'new', path ], { timeout: 250 });
    monitorSpawned(spawned, accept, reject, 0);
  });
}

function startApp(path, port, platform) {
  return new Promise((accept, reject) => {
    log.info('/execute/ backend:init running: hal9 start ' + path);
    const spawned = spawn('./hal9', [ '--nobrowse', '--port', port, 'start', path ], { timeout: 3600 * 1000 });
    monitorSpawned(spawned, accept, reject, 100);
  });
}

export const backendinit = async (req, res) => {
  log.info('/execute/ backend:init');

  const params = req.body.params;
  const backendid = req.query['backendid'];
  const platform = req.query['platform'] ?? 'R';
  const path = 'backend/' + backendid;
  const port = await getFreePort();

  const session = {
    backendid: backendid,
    port: port
  }

  log.info('/execute/ backend:init (id, port) ' + backendid + ', ' + port + ', ' + platform);

  await createNewApp(path, platform);
  await startApp(path, port, platform);

  sessionmanager.set(backendid, session);

  res.json(session);

  log.info('/execute/ backend:init success');
}
