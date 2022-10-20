import * as runbrowser from './runpipeline/runbrowser.js'
import * as runserver from './runpipeline/runserver.js'

import { log } from '../logger';

export const runpipeline = async (req, res) => {
  log.info('/execute/ pipeline');

  const runin = req.body.runin;

  if (runin == "server") {
    await runserver.runpipeline(req, res);
  }
  else {
    await runbrowser.runpipeline(req, res);
  }
}
