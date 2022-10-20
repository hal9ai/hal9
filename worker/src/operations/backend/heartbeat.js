import * as hal9 from 'hal9';
import * as sessionmanager from './sessionmanager';

import { log } from '../../logger';

export const backendheartbeat = async (req, res) => {
  log.info('/execute/ backend:heartbeat');

  const params = req.body.params;
  const backendid = req.query['backendid'];

  const session = sessionmanager.get(backendid);

  const pingurl = 'http://127.0.0.1:' + session.port + '/ping';
  log.info('/execute/ backend:heartbeat url: ' + pingurl);

  const resp = await fetch(pingurl);
  const result = await resp.text();

  res.send(result);

  log.info('/execute/ backend:heartbeat success');
}
