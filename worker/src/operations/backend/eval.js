import * as hal9 from 'hal9';
import * as sessionmanager from './sessionmanager';
import { log } from '../../logger';

export const backendeval = async (req, res) => {
  log.info('/execute/ backend:eval');

  const body = req.body;
  const backendid = req.query['backendid'];

  const session = sessionmanager.get(backendid);

  const evalurl = 'http://127.0.0.1:' + session.port + '/eval';
  log.info('/execute/ backend:eval url: ' + evalurl);

  const resp = await fetch(evalurl, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const result = await resp.json();

  res.json(result);

  log.info('/execute/ backend:eval success');
}
