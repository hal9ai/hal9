import * as hal9 from 'hal9';
import * as sessionmanager from './sessionmanager';

import { log } from '../../logger';

export const backendgetpipeline = async (req, res) => {
  log.info('/execute/ backend:getpipeline');

  const params = req.body.params;
  const backendid = req.query['backendid'];

  const session = sessionmanager.get(backendid);

  const pipelineurl = 'http://127.0.0.1:' + session.port + '/pipeline';
  log.info('/execute/ backend:getpipeline url: ' + pipelineurl);

  const resp = await fetch(pipelineurl);
  const result = await resp.json();

  res.send(result);

  log.info('/execute/ backend:getpipeline success');
}
