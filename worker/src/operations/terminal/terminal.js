import { log } from '../../logger';

import * as os from 'os';
import * as pty from 'node-pty';

let allterms = {};

export const terminit = async (req, res) => {
  log.info('/execute/ terminal:init');

  const body = req.body;
  const cols = req.body['cols'] ? parseInt(req.body['cols']) : 60;
  const rows = req.body['rows'] ? parseInt(req.body['rows']) : 3;

  const terminalid = Object.keys(allterms).length;
  allterms[terminalid] = { data: [] };

  const ptyProcess = allterms[terminalid].ptyProcess = pty.spawn('bash', [], {
    name: 'xterm',
    cols: cols,
    rows: rows,
    cwd: process.env.HOME,
    env: process.env
  });

  ptyProcess.onData((data) => {
    allterms[terminalid].data.push(data);
  });

  res.json({ terminalid: terminalid });

  log.info('/execute/ terminal:init success');
}

export const termread = async (req, res) => {
  const terminalid = req.query['terminalid'];
  log.info('/execute/ terminal:read terminalid:' + terminalid);

  const body = req.body;

  const data = allterms[terminalid].data.join('');
  allterms[terminalid].data = [];

  res.json({ output: data });

  log.info('/execute/ terminal:read success');
}

export const termwrite = async (req, res) => {
  log.info('/execute/ terminal:write');

  const body = req.body;
  const input = req.body['input']
  const terminalid = req.query['terminalid'];

  allterms[terminalid].ptyProcess.write(input);

  await new Promise((a) => setTimeout(a, 10));

  const data = allterms[terminalid].data.join('');
  allterms[terminalid].data = [];

  res.json({ output: data });

  log.info('/execute/ terminal:start write');
}

