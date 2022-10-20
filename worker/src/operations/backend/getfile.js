import * as hal9 from 'hal9';
import * as sessionmanager from './sessionmanager';
import fs from 'fs'

import { log } from '../../logger';

export const backendgetfile = async (req, res) => {
  log.info('/execute/ backend:getfile');

  const path = req.body['path'];
  const backendid = req.query['backendid'];
  const session = sessionmanager.get(backendid);
  const localpath = 'backend/' + backendid + '/' + path;

  log.info('/execute/ backend:getfile path: ' + localpath);

  const result = fs.readFileSync(localpath);

  res.send(result);

  log.info('/execute/ backend:getfile success');
}
