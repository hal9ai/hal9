import fetch from 'node-fetch';

import * as hal9 from 'hal9';

import { workerVersion } from './version';
import { register } from './register';
import { log } from './logger';
import { port } from './port';

import { operations } from './operations/operations';

// require required for klotho deployment
const express = require('express');

// hal9 gets fetch from globals
global.fetch = fetch

// handle unhandled exception to prevent server from going down
var executeRes = null;
var executeResTotal = 0;
var lifetimeRequestsCount = 0;

export function activeRequestsCount() {
  return executeResTotal;
}

export function totalRequestsCount() {
  return lifetimeRequestsCount;
}

process.on('uncaughtException', function (error) {
  log.error('uncaughtException error (' + executeResTotal + '): ' + error);
  if (executeRes && executeResTotal == 1) {
    try {
      executeRes.status(500).json({ error: error.message ? error.message : error });
    }
    catch(e) {
      log.error('failed to send error: ' + e);
    }
  }
  executeRes = null;
  executeResTotal--;
  if (executeResTotal < 0) executeResTotal = 0;
})

const app = express();
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});

app.use(express.json({limit: '250mb'}));
app.use(express.urlencoded({limit: '250mb'}));

app.get("/", (req, res) => {
  log.info(`workerVersion: ${workerVersion}, activeRequestsCount: ${activeRequestsCount()}`);
  res.send({ version: workerVersion, activeRequestsCount: activeRequestsCount() });
});

const performOperation = async (operation, req, res) => {
  executeRes = res;
  executeResTotal++;
  lifetimeRequestsCount++;
  
  try {
    if (operations[operation]) {
      await operations[operation](req, res);
    }
    else  {
      throw 'Operation ' + operation + ' not supported';
    }
  } catch (error) {
    log.error('Request error: ' + error);
    res.status(500).json({ error: error.message ? error.message : error });
  } finally {
    executeRes = null;
    executeResTotal--;
  }
}

app.post('/execute/', async (req, res) => {
  const operation = req.body.operation;
  await performOperation(operation, req, res);
});

app.post('/execute/:operation', async (req, res) => {
  const operation = req.params.operation;
  await performOperation(operation, req, res);
});

app.get('/execute/:operation', async (req, res) => {
  const operation = req.params.operation;
  await performOperation(operation, req, res);
});

app.get("/design", (req, res) => {
  res.send({}); // for klotho use
});

app.get("/pipeline", (req, res) => {
  res.send({}); // for klotho use
});

app.post("/pipeline", (req, res) => {
  res.send({}); // for klotho use
});

app.get("/config", (req, res) => {
  res.send({}); // for klotho use
});

app.post("/eval", (req, res) => {
  res.send({}); // for klotho use
});

app.get("/ping", (req, res) => {
  res.send({}); // for klotho use
});

app.get("/getfile", (req, res) => {
  res.send({}); // for klotho use
});

app.put("/putfile", (req, res) => {
  res.send({}); // for klotho use
});

/* @klotho::expose {
 *  target = "public"
 *  id = "app"
 * }
 */
app.listen(port, () => {
  console.log(`App listening on port ${port}.`);
  register();
});
