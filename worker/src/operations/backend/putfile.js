import * as hal9 from 'hal9';
import * as sessionmanager from './sessionmanager';
import fs from 'fs'

import { log } from '../../logger';

export const backendputfile = async (req, res) => {
  log.info('/execute/ backend:putfile');

  const path = req.body['path'];
  const contents = req.body['contents'];
  const backendid = req.query['backendid'];
  const session = sessionmanager.get(backendid);
  const localpath = 'backend/' + backendid + '/' + path;

  log.info('/execute/ backend:putfile path: ' + localpath);

  fs.writeFileSync(localpath, contents);

  res.json({ status: 'ok' });

  log.info('/execute/ backend:putfile success');
}
