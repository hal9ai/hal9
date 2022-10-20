import * as fs from 'fs';
import * as puppeteer from 'puppeteer';

import * as hal9 from 'hal9';

import { log } from '../../logger';
import { port } from '../../port';

// cache S3 downloads
var pipelinesCache = {};
setInterval(() => pipelinesCache = {}, 60000)

const getPipelineFromDownload = async (downloadUrl) => {
  if (pipelinesCache[downloadUrl]) return hal9.utils.clone(pipelinesCache[downloadUrl]);

  log.info('Retrieving pipeline from URL: ' + downloadUrl);

  const response = await fetch(downloadUrl);

  if (!response || response.status != 200) throw('Failed to get ' + downloadUrl + ' pipeline from s3 (' + response.status + '): ' + (await response.text()));

  let pipeline = await response.json();
  if (typeof(pipeline) == 'string') pipeline = JSON.parse(pipeline);

  pipelinesCache[downloadUrl] = hal9.utils.clone(pipeline);
  return pipeline;
}

export const runpipeline = async (req, res) => {
  log.info('/execute/ pipeline in server');

  const url = req.body.pipelineurl
  const debug = !!req.body.debug;
  const params = req.body.params;
  const downloadUrl = req.body.downloadUrl;
  
  const token = undefined;
  const pipelinepath = req.body.path;
  const owner = pipelinepath.split('/')[0];
  const pipelinename = pipelinepath.split('/')[1].replace(/&.+/g, '');
  const stop = undefined;

  let pipeline = undefined;
  if (owner == 'embedded') {
    pipeline = pipelinename;
  }
  else {
    pipeline = await getPipelineFromDownload(downloadUrl);
  }

  var logs = [];
  const oldconsole = console.log;
  if (debug) {
    console.log = (e) => logs.push((new Date()).toISOString().split('T')[1] + ': ' + e);
    console.log('Starting pipeline execution');
  }

  const pipelineId = await hal9.load(pipeline);

  const updated = await hal9.pipelines.run(
    pipelineId,
    {
      html: undefined,
      invalidateSteps: async function() {
        console.log('Invalidation not available in server APIs')
      },
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      pipelinepath: pipelinepath,
      stopid: stop,
      params: params,
      workerUrl: 'http://localhost:' + port
    },
    (pipeline, step, result, error, details) => {
      console.log(`Pipeline running, completed ${step.label} step.`);
    },
    stop
  );

  const error = await hal9.pipelines.getError(updated);
  if (error) {
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ error: error });
    return;
  }

  const result = await hal9.pipelines.getGlobals(updated);

  if (debug) {
    console.log('Finished pipeline execution');
    console.log = oldconsole;
    result.logs = logs;
  }

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
}
