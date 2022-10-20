import * as hal9 from 'hal9';

import * as puppeteer from 'puppeteer';
import fetch from 'node-fetch';
import * as fs from 'fs';
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const spawn = require('child_process').spawn;

import * as remoteconsole from '../remoteconsole';
import * as remotedf from '../remotedf';
import { log } from '../logger';

const getDeps = (others) => {
  return Object.assign(others, {
    btoa: e => Buffer.from(e).toString('base64'),
    puppeteer: puppeteer,
    fetch: fetch,
    fs: fs,
    exec: exec,
    spawn: spawn,
    Sharp: require('sharp'),
    path: require('path'),
    util: require('util'),
    mysql: require('mysql'),
    arrow: require('apache-arrow'),
    aq: require('arquero'),
    crypto: require('crypto'),
    exiftool: require('exiftool-vendored'),
    extractzip: require('extract-zip'),
  });
}

export const runstep = async (req, res) => {
  log.info('/execute/ runstep');

  const params = req.body.params;

  // we create a mock pipeline for the hal9 api to work
  const mockPipeline = await hal9.pipelines.create([]);
  const mockStep = await hal9.pipelines.addStep(mockPipeline, params.step);

  const deps = getDeps({
    hal9: hal9.stepapi.create(mockPipeline, mockStep.id, params.context),
    console: new remoteconsole.RemoteConsole(params.sessionid)
  });

  remotedf.setDeps(deps);
  params.inputs = await remotedf.hydrate(params.inputs, deps);

  const executor = new hal9.executors.LocalExecutor(
    params.metadata,
    params.inputs,
    params.step,
    params.context,
    params.script,
    params.params,
    deps,
    // state
    undefined,
    params.language,
    params.pipelinename
  );

  var result = await executor.runStep();

  if (params.metadata && params.metadata.remotedf) result = await remotedf.dehydrate(result, deps, params.metadata.remotedf);

  // clone results to remove custom toString() overloads from arquero.js, etc.
  result = hal9.utils.clone(result);

  res.send(result);

  log.info('/execute/ runstep success');
}
