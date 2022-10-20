import * as fs from 'fs';
import * as puppeteer from 'puppeteer';

import { log } from '../../logger';

export const runpipeline = async (req, res) => {
  log.info('/execute/ pipeline in browser');

  const url = req.body.pipelineurl + '&wait=true';
  const pipeline = !!req.body.pipeline;
  const debug = !!req.body.debug;
  const embedded = !!req.body.embedded;
  const params = req.body.params;

  log.info('/execute/ pipeline request for ' + url + 'params(' + Object.keys(params).join(',') +  ') ' + ' debug(' + debug + ')');
  if (params.image) log.info('/execute/ pipeline with image ' + params.image.substr(0, 30));

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--lang=en-US'
    ]
  });

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);

  await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US' });

  log.info('/execute/ loading url ' + url);
  await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });
  log.info('/execute/ url loaded');

  var logs = [];
  page.on('console', message => {
    const msg = message.text().toString();
    log.info('/execute/ console: ' + msg);
    logs.push(msg);
  });

  var error = undefined;
  var result = {};
  try {
    await page.evaluate((params) => {
      if (!window.hal9) window.hal9 = {};
      window.hal9.remote = true;
      window.hal9.params = params;
      window.hal9.wait = false;

      console.log('Initializing params(' + Object.keys(params).join(',') + ')');
      if (params.image) console.log('Initializing params with image ' + params.image.substr(0, 30));
    }, params);
    
    await page.waitForFunction(() => window.hal9.loaded);

    await page.evaluate(() => console.log('Pipeline loaded state: ' + window.hal9.loaded));

    var error = await page.evaluate(() => {
      // "evaluate" removes non-enumerable properties (such as message)
      return window.hal9.error?.toString();
    });
    if (error) throw error;

    await page.waitForFunction(() => window.hal9.result);
    result = await page.evaluate(() => {
      return window.hal9.result;
    });

    var error = await page.evaluate(() => {
      // "evaluate" removes non-enumerable properties (such as message)
      return window.hal9.error?.toString();
    });
    if (error) throw error;
  }
  catch(e) {
    error = e;
  }

  if (debug) {
    log.info('/execute/ debug information requested');

    result.error = error;

    await page.screenshot({ path: `screenshot.jpg`, fullPage: true });
    result.logs = logs;

    const contents = fs.readFileSync('screenshot.jpg', {encoding: 'base64'});
    result.screenshot = 'data:image/jpg;base64,' + contents;
  }

  await page.close();
  await browser.close();

  if (error && !debug) {
    throw error;
  }

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));

  log.info('/execute/ success and retrieving result');
}
