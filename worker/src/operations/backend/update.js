import * as hal9 from 'hal9';

import { log } from '../../logger';

export const backendupdate = async (req, res) => {
  log.info('/execute/ backend:update');

  const params = req.body.params;

  const result = { status: 'ok' }

  res.send(result);

  log.info('/execute/ backend:update success');
}
