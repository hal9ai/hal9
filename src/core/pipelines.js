// @flow

import iristxt from '../../scripts/import/iris.txt.js';
import imagestxt from '../../scripts/import/images.txt.js';

import importcsvtxt from '../../scripts/import/csv.txt.js';
import importjsontxt from '../../scripts/import/json.txt.js';
import importexceltxt from '../../scripts/import/excel.txt.js';

import webtablestxt from '../../scripts/import/webtable.txt.js';
import webimagestxt from '../../scripts/import/webimages.txt.js';

import bubblestxt from '../../scripts/visualizations/bubbles.txt.js';
import gallerytxt from '../../scripts/visualizations/gallery.txt';
import networktxt from '../../scripts/visualizations/network.txt.js';
import threejstxt from '../../scripts/visualizations/three.txt.js';
import wordcloudtxt from '../../scripts/visualizations/wordcloud.txt.js';
import mapcharttxt from '../../scripts/visualizations/map.txt.js';

import barcharttxt from '../../scripts/charts/barchart.txt.js';
import scattercharttxt from '../../scripts/charts/scatterchart.txt.js';
import errorbarcharttxt from '../../scripts/charts/errorbarchart.txt.js';
import heatmapcharttxt from '../../scripts/charts/heatmapchart.txt.js';
import histogramcharttxt from '../../scripts/charts/histogramchart.txt.js';
import linecharttxt from '../../scripts/charts/linechart.txt.js';
import sankeycharttxt from '../../scripts/charts/sankeychart.txt.js';
import treemapcharttxt from '../../scripts/charts/treemapchart.txt.js';
import waterfallcharttxt from '../../scripts/charts/waterfallchart.txt.js';

import converttxt from '../../scripts/transforms/convert.txt.js';
import explodetxt from '../../scripts/transforms/explode.txt.js';
import jointxt from '../../scripts/transforms/join.txt.js';
import fetchtxt from '../../scripts/transforms/fetch.txt.js';
import filtertxt from '../../scripts/transforms/filter.txt.js';
import derivetxt from '../../scripts/transforms/derive.txt.js';
import rangetxt from '../../scripts/transforms/range.txt.js';
import sampletxt from '../../scripts/transforms/sample.txt.js';
import selecttxt from '../../scripts/transforms/select.txt.js';
import sorttxt from '../../scripts/transforms/sort.txt.js';
import slicetxt from '../../scripts/transforms/slice.txt.js';
import summarizetxt from '../../scripts/transforms/summarize.txt.js';
import subsprevtxt from '../../scripts/transforms/subsprev.txt.js';
import sqltxt from '../../scripts/transforms/sql.txt.js';
import columntxt from '../../scripts/transforms/column.txt.js';
import imputetxt from '../../scripts/transforms/impute.txt.js';

import mobilenettxt from '../../scripts/predict/mobilenet.txt.js';
import timeseriespredicttxt from '../../scripts/predict/timeseries.txt.js';
import regressionpredicttxt from '../../scripts/predict/regression.txt.js';
import sentimenttxt from '../../scripts/predict/sentiment.txt.js';
import bodypixtxt from '../../scripts/predict/bodypix.txt.js';
import knntxt from '../../scripts/predict/knn.txt.js';

import copytxt from '../../scripts/utils/copy.txt.js';
import pastetxt from '../../scripts/utils/paste.txt.js';
import tojsontxt from '../../scripts/utils/tojson.txt';
import webcamtxt from '../../scripts/import/webcam.txt.js';

import exportcsvtxt from '../../scripts/export/csv.txt.js';

import airbnbtxt from '../../scripts/services/airbnb.txt.js';
import twittertxt from '../../scripts/services/twitter.txt.js';

import htmltxt from '../../scripts/languages/html.txt';
import markdowntxt from '../../scripts/languages/markdown.txt';
import pyodidetxt from '../../scripts/languages/pyodide.txt.js';
import pythontxt from '../../scripts/languages/python.txt';
import rtxt from '../../scripts/languages/r.txt';
import javascripttxt from '../../scripts/languages/javascript.txt';

import vuetxt from '../../scripts/frameworks/vue.txt';
import reacttxt from '../../scripts/frameworks/react.txt';

import * as snippets from './snippets';
import * as operations from './utils/operations';
import * as dataframe from './utils/dataframe';
import clone from './utils/clone';
import * as environment from './utils/environment'

import * as executors from './executors/executors';

import * as store from './pipelinestore.js';
import * as api from './api.js';

import * as languages from './interpreters/languages'

import * as datatable from '../../libs/jedit/jedit.js';
import datatablecss from "../../libs/jedit/jedit.css";

var gloablDeps = {};

/*::
type paramid = number;
type param = { id: paramid, name: string, label: string, value: Array<Object> };
type params = { [key: string]: param };
type step = { id: number, name: string, language: string };
type stepid = number;
type steps = Array<step>;
type output = { id: number, name: string, label: string };
type outputs = { [id: string]: output };
type source = { id: number, name: string, label: string };
type sources = { [id: string]: source };
type context = { html: Object };
type pipeline = { params: params, steps: steps, sources: sources, ... };
type pipelineid = string;
type metadata = { params: params, deps: Array<string>, environment: string };
type block = { id: number, name: string, params: params, error: string, metadata: metadata, script: string };
type blocks = Array<block>;
*/

const scripts = {
  // import
  iris: { script: iristxt, language: 'javascript' },
  images: { script:  imagestxt, language: 'javascript' },
  importcsv: { script:  importcsvtxt, language: 'javascript' },
  importjson: { script:  importjsontxt, language: 'javascript' },
  importexcel: { script:  importexceltxt, language: 'javascript' },
  webcam: { script:  webcamtxt, language: 'javascript' },

  // webscraping
  webtables: { script:  webtablestxt, language: 'javascript' },
  webimages: { script:  webimagestxt, language: 'javascript' },

  // transforms
  convert: { script:  converttxt, language: 'javascript' },
  explode: { script:  explodetxt, language: 'javascript' },
  fetch: { script:  fetchtxt, language: 'javascript' },
  filter: { script:  filtertxt, language: 'javascript' },
  join: { script:  jointxt, language: 'javascript' },
  range: { script:  rangetxt, language: 'javascript' },
  derive: { script:  derivetxt, language: 'javascript' },
  sample: { script:  sampletxt, language: 'javascript' },
  select: { script:  selecttxt, language: 'javascript' },
  slice: { script:  slicetxt, language: 'javascript' },
  summarize: { script:  summarizetxt, language: 'javascript' },
  sort: { script:  sorttxt, language: 'javascript' },
  sql: { script:  sqltxt, language: 'javascript' },
  subsprev: { script:  subsprevtxt, language: 'javascript' },
  column: { script:  columntxt, language: 'javascript' },
  impute: { script: imputetxt, language: 'javascript' },

  // visualizations
  bubbles: { script:  bubblestxt, language: 'javascript' },
  network: { script:  networktxt, language: 'javascript' },
  threejs: { script:  threejstxt, language: 'javascript' },
  wordcloud: { script:  wordcloudtxt, language: 'javascript' },
  mapchart: { script:  mapcharttxt, language: 'javascript' },
  gallery: { script:  gallerytxt, language: 'html' },

  // predictions
  mobilenet: { script:  mobilenettxt, language: 'javascript' },
  timeseriespredict: { script:  timeseriespredicttxt, language: 'javascript' },
  regressionpredict: { script:  regressionpredicttxt, language: 'javascript' },
  sentiment: { script:  sentimenttxt, language: 'javascript' },
  bodypix: { script:  bodypixtxt, language: 'javascript' },
  knn: { script:  knntxt, language: 'javascript' },

  // train

  // charts
  barchart: { script:  barcharttxt, language: 'javascript' },
  scatterchart: { script:  scattercharttxt, language: 'javascript' },
  errorbarchart: { script:  errorbarcharttxt, language: 'javascript' },
  heatmapchart: { script:  heatmapcharttxt, language: 'javascript' },
  histogramchart: { script:  histogramcharttxt, language: 'javascript' },
  linechart: { script:  linecharttxt, language: 'javascript' },
  sankeychart: { script:  sankeycharttxt, language: 'javascript' },
  treemapchart: { script:  treemapcharttxt, language: 'javascript' },
  waterfallchart: { script:  waterfallcharttxt, language: 'javascript' },

  // utils
  copy: { script:  copytxt, language: 'javascript' },
  paste: { script:  pastetxt, language: 'javascript' },
  tojson: { script: tojsontxt, language: 'javascript' },

  // export
  exportcsv: { script:  exportcsvtxt, language: 'javascript' },

  // services
  airbnb: { script:  airbnbtxt, language: 'javascript' },
  twitter: { script:  twittertxt, language: 'javascript' },

  // languages
  html: { script:  htmltxt, language: 'html' },
  markdown: { script:  markdowntxt, language: 'markdown' },
  pyodide: { script:  pyodidetxt, language: 'javascript' },
  python: { script:  pythontxt, language: 'python' },
  r: { script:  rtxt, language: 'r' },
  javascript: { script: javascripttxt, language: 'javascript' },

  // frameworks
  vue: { script:  vuetxt, language: 'html' },
  react: { script:  reacttxt, language: 'html' },
}

var pipelinesStateCount = 0;
var pipelinesState = {};
var pipelinesCallbacks = {};

var fetchedScripts = {};

const scriptFromStep = (pipeline /* pipeline */, step /*: step */) /*: string */ => {
  var language = step.language;
  var text = undefined;

  if (pipeline.scripts[step.id])
    text = pipeline.scripts[step.id];
  else if (fetchedScripts[step.url])
    text = fetchedScripts[step.url];
  else if (scripts[step.name]) {
    text = scripts[step.name].script;
    language = scripts[step.name].language;
  }
  else
    text = '';

  return { script: text, language: language };
}

const paramsFromStep = (pipeline /* pipeline */, step /*: step */) /*: params */ => {
  if (pipeline.params[step.id]) return clone(pipeline.params[step.id]);
  return clone(paramsFromScript(scriptFromStep(pipeline, step).script));
}

const paramsFromScript = (script /*: string */) /*: params */ => {
  var codeparams = snippets.parseParams(script);

  var idx = 0;
  var retparams = Object.fromEntries(codeparams.map((e) => {
    if (typeof(e) === 'string')
      return [ e, { id: idx++, name: e, label: e, static: false, value: [] } ];
    else if (e === null)
      return [ '', { id: idx++, static: false, value: [] } ];
    else {
      if (e.value) {
        e.value.map(e => Object.assign(e, { id: idx++ }));
      }
      return [ e.name, Object.assign({ id: idx++, static: !!e.value, value: [] }, e) ]
    }
  }));

  return retparams;
}

const metadataFromScript = (script /*: string */) /* metadata */ => {
  var header = snippets.parseHeader(script);

  var id = 0;
  if (header.params) {
    header.params = header.params.map(e => {
      if (typeof(e) === 'string')
        return { name: e, label: e };
      else {
        if (e.value) {
          e.value.map(e => Object.assign(e, { id: id++ }));
        }
        return e;
      }
    })
  }

  return header;
}

const metadataFromStepScript = (pipeline /* pipeline */, step /*: step */) /* metadata */ => {
  return metadataFromScript(scriptFromStep(pipeline, step).script);
}

const createInt = (steps /*: steps */, previous /*: pipeline */ ) /*: pipeline */ => {
  const pipeline = {
    id: previous.id ? previous.id : Math.floor(Math.random() * 10000000),
    steps: [],
    params: {},
    outputs: {},
    errors: {},
    scripts: previous && previous.scripts ? previous.scripts : {},
    globals: {},
    error: undefined,
    version: '0.0.1',
    metadata: clone(previous.metadata),
  };

  steps = clone(steps);
  pipeline.steps = steps;

  steps.forEach((step, idx) => {
    var params = paramsFromStep(pipeline, step);

    if (!step.language || step.language == 'js') step.language = 'javascript';

    if (step.params) {
      params = step.params;
    }

    if (step.id === undefined) {
      step.id = idx;
    }

    if (previous.params && previous.params[step.id]) {
      params = Object.assign(params, previous.params[step.id]);
    }

    setParamsInt(pipeline, step.id, params);

    const preStep = previous.steps ? previous.steps.filter(e => e.id === pipeline.steps[idx].id) : [];
    pipeline.steps[idx].language = preStep.length == 1 ? preStep[0].language : undefined;
  });

  return pipeline;
}

export const create = (steps /*: steps */) /*: pipelineid */ => {
  const pipeline = createInt(steps, {});
  const pipelineid = store.add(pipeline);
  return pipelineid;
}

export const fetchScripts = async (steps /*: steps */) => {
  if (!steps) return;
  await Promise.all(steps.map(step => {
    return (async (step) => {
      if (step.url && !fetchedScripts[step.url]) {
        const fullUrl = step.url.startsWith('http://') || step.url.startsWith('https://');
        const url = fullUrl ? step.url : 'https://raw.githubusercontent.com/hal9ai/hal9ai/main/scripts/' + step.url;
        const response = await fetch(url);
        fetchedScripts[step.url] = await response.text();
      }
    })(step);
  }));
}

export const update = (pipelineid /*: pipelineid */, steps /*: steps */) /*: void */ => {
  const pipelineold = store.get(pipelineid);
  const pipelinenew = createInt(steps, pipelineold);
  pipelinenew.version = pipelineold.version;
  store.update(pipelineid, pipelinenew);
}

export const remove = (pipelineid /*: pipelineid */) /*: void */ => {
  store.remove(pipelineid);
}

const stepGetDefinition = (pipeline, step) => {
  step = Object.assign({}, step);
  Object.assign(step, {
    params: paramsFromStep(pipeline, step)
  });

  if (pipeline.scripts[step.id])
    step.script = pipeline.scripts[step.id];

  return step;
}

export const getGlobalDeps = async () => {  
  return gloablDeps;
}

export const runStep = async(pipelineid /*: pipeline */, sid /*: number */, context /* context */, partial) /*: boolean */ => {
  var pipeline = store.get(pipelineid);
  const step = stepFromId(pipeline, sid);
  var result = {};

  var globals = getGlobals(pipeline);
  var state = getState(pipelineid, step.id);
  var callbacks = getCallbacks(pipelineid, step.id);
  var details = {};
  var resultNames = [];

  var error = '';
  try {
    const metadata = metadataFromStepScript(pipeline, step);
    if (metadata.invalid) {
      throw 'Script header is invalid: ' + metadata.invalid;
    }

    var input = {}

    // assign only globals being used to prevent cache invalidations
    for (var inputidx in metadata.input) {
      const inputName = metadata.input[inputidx];
      input[inputName] =  undefined;
      if (typeof(globals[inputName]) !== 'undefined') input[inputName] = globals[inputName];
    }

    // upgrade old pipelines, can be removed eventually
    if (!pipeline.version) {
      for (var paramidx in metadata.params) {
        const param = metadata.params[paramidx];
        if (typeof(globals[param.name]) !== 'undefined') input[param.name] = globals[param.name];
      }
    }

    var params = pipeline.params[step.id] ? clone(pipeline.params[step.id]) : {};

    // add default parameters
    var paramsDefault = paramsFromScript(scriptFromStep(pipeline, step).script);
    Object.keys(paramsDefault).forEach(param => {
      if (!Object.keys(params).includes(param)) params[param] = clone(paramsDefault[param]);
    });

    // add context parameters
    if (typeof(window) != 'undefined' && window.hal9 && window.hal9.params) context.params = window.hal9.params;
    if (context.params) {
      var paramIdx = Object.keys(params).length > 0 ? Math.max(...Object.keys(params).map(e => params[e].id ? params[e].id : 0)) : 0;
      Object.keys(context.params).forEach(param => {
        params[param] = { id: paramIdx++, name: param, label: param, value: [{
          value: clone(context.params[param]) 
        }] };
      });
    }

    const deps = await getGlobalDeps();

    // add hal9 api to deps
    deps['hal9'] = api.create(pipelineid, sid, context);

    const script = scriptFromStep(pipeline, step);
    const executor = executors.executorFromMetadata(
      metadata,
      input,
      step,
      context,
      script.script,
      params,
      deps,
      state,
      script.language,
      callbacks,
      pipeline.metadata ? pipeline.metadata.name : undefined);

    result = await executor.runStep();

    // truncate data if needed
    if (result && result.data && Array.isArray(result.data) && context.maxRows && result.data.length && result.data.length > context.maxRows) {
      details.truncated = { truncation: context.maxRows };

      result.data.splice(context.maxRows);
      if (result.state && result.state.cache && result.state.cache.result && result.state.cache.result.data) {
        result.state.cache.result.data.splice(context.maxRows + 1);
      }
    }

    for (var resultname in result) {
      var resultentry = result[resultname];

      if (step.output && step.output[resultname]) {
        resultname = step.output[resultname];
      }

      resultNames.push(resultname);
      globals[resultname] = resultentry;
    }
  }
  catch(e) {
    console.log(e);
    error = e.toString();
  }

  setErrors(pipeline, step.id, error);
  if (result.state) setState(pipelineid, step.id, Object.assign(state ? state : {}, result.state));
  setGlobals(pipeline, globals);

  var outputs = undefined;
  if (result.data) {
    outputs = dataframe.columns(result.data).map((col, idx) => {
      return { id: idx, name: col, label: col };
    });
  }
  setOutputs(pipeline, step.id, outputs);

  const visibleResults = resultNames.filter(e => e != 'state');
  const resultsMap = Object.fromEntries(visibleResults.map(e => [e, e]));
  partial(pipelineid, step, resultsMap, error, details);

  return error === '';
}

const stepHasHtml = (pipeline, step) => {
  const langInfo = languages.getLanguageInfo(step.language);
  if (langInfo.html) return true;

  var header = snippets.parseHeader(scriptFromStep(pipeline, step).script);
  return header && header.output && header.output.filter(e => e == 'html').length > 0;
}

export const preparePartial = (pipeline, context, partial, renderid) => {
  var html = context.html;
  if (typeof(html) === 'object') {
    const isFullView = renderid === null || renderid === undefined;

    const oneHasHtml = pipeline.steps.map(step => stepHasHtml(pipeline, step)).filter(e => e).length > 0;

    // add support for viewing data tables
    if (!isFullView || !oneHasHtml) {
      if (!oneHasHtml) {
        renderid = pipeline.steps[pipeline.steps.length - 1].id;
      }

      var step = stepFromId(pipeline, renderid);
      var header = snippets.parseHeader(scriptFromStep(pipeline, step).script);
      const hasHtml = stepHasHtml(pipeline, step);
      if (!hasHtml) {
        return function(pipeline, step, result, error, details) {
          html = html.shadowRoot ? html.shadowRoot : html;
          html.innerHTML = '';

          var style = document.createElement('style');
          style.innerHTML = datatablecss;
          style.id = 'hal9__datatable__style';
          html.appendChild(style);

          var area = document.createElement('div');
          
          var tabs = document.createElement('div');
          tabs.style.display = 'flex';
          tabs.style.flexDirection = 'row';
          html.appendChild(tabs);
          if (Object.keys(result).length > 1) {
            Object.keys(result).forEach((r, tabIdx) => {
              var tab = document.createElement('a');
              tab.href = '#';
              tab.style.paddingRight = '6px';
              tab.style.textDecoration = 'none';
              tab.style.color = '#528efd';
              tab.innerText = r;
              tab.onclick = () => {
                for (let i = 0; i < area.children.length; i++) area.children[i].style.display = 'none';
                area.children[tabIdx].style.display = 'block';
              };

              tabs.appendChild(tab);
            });
          }

          html.appendChild(area);
          Object.keys(result).forEach((r, idx) => {
            var output = document.createElement('div');
            if (idx > 0) output.style.display = 'none';
            area.appendChild(output);

            datatable.build(output, getGlobal(pipeline, result[r]));
          });

          partial(pipeline, step, result, error, details);
        }
      }
    }
  }

  return partial;
}

export const prepareContext = (pipeline, context, stepstopid) => {
  const parent = context.html;
  if (typeof(parent) === 'object') {
    const height = parent.offsetHeight;

    parent.innerHTML = '';
    const html = parent.shadowRoot ? parent.shadowRoot : parent.attachShadow({mode: 'open'});
    html.innerHTML = '';

    const isFullView = stepstopid === null || stepstopid === undefined;

    // add support for generating html blocks
    context.html = (step) => {
      var header = snippets.parseHeader(scriptFromStep(pipeline, step).script);
      var hasHtml = header && header.output && header.output.filter(e => e == 'html').length > 0;

      const langInfo = languages.getLanguageInfo(step.language);
      if (langInfo.html) hasHtml = true;

      if (isFullView && hasHtml) {
        const output = html.querySelector(':scope .hal9-step-' + step.id);
        if (output) return output;

        var container = document.createElement('div');
        container.className = 'hal9-step-' + step.id;
        container.style.width = '100%';

        if (langInfo.height) {
          container.style.height = langInfo.height;
        }
        else {
          container.style.height = height + 'px';
        }
        
        html.appendChild(container);

        return container;
      }
      else if (stepstopid == step.id) {
        const output = html.querySelector(':scope .hal9-step-' + step.id);
        if (output) return output;

        var container = document.createElement('div');
        container.className = 'hal9-step-' + step.id;
        container.style.width = '100%';
        container.style.height = '100%';

        html.appendChild(container);

        return container;
      }
      else {
        const sandbox = html.querySelector(':scope .hal9-step-sandbox');
        if (sandbox) {
          sandbox.innerHTML = '';
          return sandbox;
        }

        var container = document.createElement('div');
        container.className = 'hal9-step-sandbox';
        container.style.width = '0';
        container.style.height = '0';
        container.style.position = 'absolute';
        container.style.display = 'none';
        html.appendChild(container);

        return container;
      }
    }
  }
}

export const run = async (pipelineid /*: pipeline */, context /* context */, partial, stepstopid /* stepid */ ) /*: void */ => {
  var pipeline = store.get(pipelineid);
  if (!pipeline || pipeline.length == 0) return;

  await fetchScripts(pipeline.steps);

  partial = preparePartial(pipeline, context, partial, stepstopid);
  prepareContext(pipeline, context, stepstopid);

  pipeline.errors = {};
  pipeline.error = undefined;
  setGlobals(pipeline, {});

  for (var idx = 0; idx < pipeline.steps.length; idx++) {
    const step = pipeline.steps[idx];

    const success = await runStep(pipelineid, step.id, context, partial);

    if (!success) {
      pipeline.error = pipeline.errors[step.id];
      break;
    }

    if (stepstopid != undefined && step.id === stepstopid) break;
  };

  return pipelineid;
}

export const getError = (pipelineid /*: pipelineid */) => {
  var pipeline = store.get(pipelineid);
  return pipeline.error;
}

export const getParams = (pipelineid /*: pipelineid */, sid /*: stepid */) /*: params */ => {
  var pipeline = store.get(pipelineid);
  return clone(pipeline.params[sid]);
}

const setParamsInt = (pipeline /*: pipeline */, sid /*: stepid */, params /*: params */) /*: void */ => {
  pipeline.params[sid] = clone(params);

  const stepIdx = stepIdxFromId(pipeline, sid);
  if (stepIdx !== -1) pipeline.steps[stepIdx].params = clone(params);
}

export const setParams = (pipelineid /*: pipelineid */, sid /*: stepid */, params /*: params */) /*: void */ => {
  var pipeline = store.get(pipelineid);
  setParamsInt(pipeline, sid, params);
}

export const stepIdFromIdx = (pipelineid /*: pipelineid */, index /*: number */) /*: number */ => {
  var pipeline = store.get(pipelineid);
  return pipeline.steps[index].id;
}

export const mergeParams = (pipelineid /*: pipelineid */, sid /*: stepid */, params /*: params */) /*: void */ => {
  if (!params) return;

  var pipeline = store.get(pipelineid);
  pipeline.params[sid] = Object.assign(pipeline.params[sid] ? pipeline.params[sid] : {}, clone(params));
}

const paramNameFromId = (pipeline /*: pipeline */, sid /*: stepid */, pid /*: paramid */) /*: number */ => {
  return Object.keys(pipeline.params[sid]).filter(key => pipeline.params[sid][key].id == pid)[0];
}

export const mergeParam = (pipelineid /*: pipelineid */, sid /*: stepid */, pid /*: paramid */, field /*: Object */) /*: void */ => {
  var pipeline = store.get(pipelineid);

  field = clone(field);
  var pname = paramNameFromId(pipeline, sid, pid);
  var value = pipeline.params[sid][pname].value;
  const valueIdx = value.length == 1 ? 0 : value.findIndex(x => x.id == field.id);

  if (field.sid !== undefined) delete field.sid;
  if (field.pid !== undefined) delete field.pid;
  pipeline.params[sid][pname].value[valueIdx] = field;
}

export const updateParamField = (pipelineid /*: pipelineid */, sid /*: stepid */, param /*: string */, fidx /* number */, update /*: param */) => {
  var pipeline = store.get(pipelineid);
  pipeline.params[sid][param].value[fidx] = Object.assign(pipeline.params[sid][param].value[fidx], update);
}

export const getFields = (pipelineid /*: pipelineid */) => {
  var pipeline = store.get(pipelineid);

  return pipeline.steps.flatMap(step => {
    if (!pipeline.params[step.id]) return [];

    return Object.entries(pipeline.params[step.id]).flatMap(([paramname, param]) => {
      return param.value.map(field => {
        return Object.assign({
          sid: step.id,
          label: param.label,
          pid: param.id
        }, clone(field));
      });
    });
  });
}

export const getSteps = (pipelineid /*: pipelineid */) /*: steps */ => {
  var pipeline = store.get(pipelineid);
  return clone(pipeline.steps);
}

const stepIdxFromId = (pipeline /*: pipeline */, sid /*: stepid */) => {
  return Object.keys(pipeline.steps).findIndex(key => pipeline.steps[key].id == sid)
}

export const updateStep = (pipelineid /*: pipelineid */, step /*: step */) /*: void */ => {
  var pipeline = store.get(pipelineid);
  const stepidx = stepIdxFromId(pipeline, step.id);
  pipeline.steps[stepidx] = clone(step);
}

export const addStep = (pipelineid /*: pipelineid */, step /*: step */) /*: step */ => {
  step = clone(step);
  var pipeline = store.get(pipelineid);

  var maxId = getMaxId(pipelineid);
  if (typeof(step.id) === 'undefined' || step.id <= maxId) {
    step.id = maxId + 1;
  }

  // avoid overlaping with library scripts defined in pipeline.vue
  if (step.id < 10000) {
    step.id = step.id + 10000
  }

  if (step.id < maxId) {
    step.id = maxId + 1;
  }

  if (typeof(step.name) === 'undefined') {
    step.name = 'unnamed';
  }

  if (typeof(step.label) === 'undefined') {
    step.label = step.name;
  }

  var params = paramsFromStep(pipeline, step);
  step.params = params;

  if (step.params) {
    pipeline.params[step.id] = step.params;
  }

  const scriptInfo = scriptFromStep(pipeline, step);
  step.script = scriptInfo.script;
  step.language = scriptInfo.language;

  pipeline.steps.push(step);

  return step;
}

export const removeStep = (pipelineid /*: pipelineid */, step /*: step */) /*: void */ => {
  var pipeline = store.get(pipelineid);

  pipeline.steps = pipeline.steps.filter(e => e.id != step.id)
}

export const moveStep = (pipelineid /*: pipelineid */, stepid /*: stepid */, change /* number */) /*: void */ => {
  var pipeline = store.get(pipelineid);
  if (![1, -1].includes(change)) throw 'Operation is not supported';

  const index = stepIdxFromId(pipeline, stepid);
  if (change < 0 && index > 0) {
    var step = pipeline.steps[index - 1];
    pipeline.steps[index - 1] = pipeline.steps[index];
    pipeline.steps[index] = step;
  }
  else if (change > 0 && index < pipeline.steps.length - 1) {
    var step = pipeline.steps[index + 1];
    pipeline.steps[index + 1] = pipeline.steps[index];
    pipeline.steps[index ] = step;
  }

  return step;
}

export const getNested = (pipelineid /*: pipelineid */) /*: blocks */ => {
  var pipeline = store.get(pipelineid);
  return clone(
    pipeline.steps.map(step => {
      const script = scriptFromStep(pipeline, step);
      return Object.assign(step, {
        params: paramsFromStep(pipeline, step),
        error: pipeline.errors[step.id] ? pipeline.errors[step.id] : '',
        metadata: metadataFromStepScript(pipeline, step),
        script: script.script,
        language: script.language
      })
    })
  );
}

const getDefinition = (pipeline /*: pipeline */) /*: steps */ => {
  return clone(pipeline.steps.map(step => stepGetDefinition(pipeline, step)));
}

const setOutputs = (pipeline /*: pipeline */, sid /*: number */, outputs /*: outputs */) /*: void */ => {
  pipeline.outputs[sid] = clone(outputs);
}

const stepFromId = (pipeline /*: pipeline */, sid /*: number */, offset = 0 /* number */) /* step */ => {
  const index = stepIdxFromId(pipeline, sid) + offset;
  return index >= 0 && index < pipeline.steps.length ? pipeline.steps[index] : null;
}

export const getStep = (pipelineid /*: pipelineid */, sid /*: number */) /* step */ => {
  var pipeline = store.get(pipelineid);
  return stepFromId(pipeline, sid);
}

export const prevStep = (pipelineid /*: pipelineid */, sid /*: number */) /* step */ => {
  var pipeline = store.get(pipelineid);
  return clone(stepFromId(pipeline, sid, -1));
}

export const getSources = (pipelineid /*: pipelineid */, sid /*: number */) /*: sources */ => {
  var pipeline = store.get(pipelineid);

  var prev = null;
  var previd = sid;

  // search backwards for the block that has column outputs
  do {
    prev = prevStep(pipelineid, previd);
    if (prev != null) previd = prev.id;
  } while (prev != null && pipeline.outputs[previd] == undefined)

  return prev ? (pipeline.outputs[previd] ? clone(pipeline.outputs[previd]) : undefined) : undefined;
}

const setErrors = (pipeline /*: pipeline */, sid /*: number */, error /*: string */) /*: void */ => {
  pipeline.errors[sid] = error;
}

export const getStepError = (pipelineid /*: pipelineid */, sid /*: number */) /*: string */ => {
  var pipeline = store.get(pipelineid);
  return clone(pipeline.errors[sid]);
}

export const setScript = (pipelineid /*: pipelineid */, sid /*: number */, script /*: string */) /*: void */ => {
  var pipeline = store.get(pipelineid);
  const step = stepFromId(pipeline, sid);

  const oldscript = scriptFromStep(pipeline, step).script;
  const oldmeta = JSON.stringify(metadataFromScript(oldscript));
  const newmeta = JSON.stringify(metadataFromScript(script));

  if (oldmeta != newmeta) {
    // only override params when the script metadata been changed
    setParamsInt(pipeline, sid, paramsFromScript(script));
  }

  pipeline.scripts[sid] = script;
}

export const getScript = (pipelineid /*: pipelineid */, sid /*: number */) /*: string */ => {
  var pipeline = store.get(pipelineid);
  const step = stepFromId(pipeline, sid);
  return scriptFromStep(pipeline, step).script;
}

export const getHashable = (pipelineid /*: pipelineid */) /*: string */ => {
  var pipeline = store.get(pipelineid);
  return JSON.stringify({ definition: getDefinition(pipeline), stateId: pipelinesStateCount });
}

export const setState = (pipelineid /*: pipelineid */, sid /*: number */, state /*: Object */) /*: void */ => {
  if (!pipelinesState[pipelineid]) pipelinesState[pipelineid] = { steps: {} };
  pipelinesState[pipelineid].steps[sid] = state;
  pipelinesStateCount++;
}

export const getState = (pipelineid /*: pipelineid */, sid /*: number */) /*: Object */ => {
  if (!pipelinesState[pipelineid]) return {};
  return pipelinesState[pipelineid].steps[sid];
}

export const clearState = (pipelineid /*: pipelineid */) /*: void */ => {
  pipelinesState[pipelineid] = { steps: {} };
  pipelinesStateCount++;
}

export const setCallback = (pipelineid /*: pipelineid */, sid /*: number */, name /* string */, callback /*: Object */) /*: void */ => {
  if (!pipelinesCallbacks[pipelineid]) pipelinesCallbacks[pipelineid] = { steps: {} };
  if (!pipelinesCallbacks[pipelineid].steps[sid]) pipelinesCallbacks[pipelineid].steps[sid] = {}
  pipelinesCallbacks[pipelineid].steps[sid][name] = callback;
}

export const getCallback = (pipelineid /*: pipelineid */, sid /*: number */) /*: Object */ => {
  if (!pipelinesCallbacks[pipelineid]) return null;
  if (!pipelinesCallbacks[pipelineid].steps[sid]) return null;
  return pipelinesCallbacks[pipelineid].steps[sid][name];
}

const getCallbacks = (pipelineid /*: pipelineid */, sid /*: number */) /*: Object */ => {
  if (!pipelinesCallbacks[pipelineid]) return {};
  if (!pipelinesCallbacks[pipelineid].steps[sid]) return {};
  return pipelinesCallbacks[pipelineid].steps[sid];
}

export const getSaveText = (pipelineid /*: pipelineid */, padding /* number */) /*: string */ => {
  var pipeline = clone(store.get(pipelineid));

  // no point in saving global state since it's always recreated when running the pipeline
  if (pipeline.globals) delete pipeline.globals;

  pipeline.state = pipelinesState[pipelineid];

  if (pipeline.state) {
    for (var stepid in pipeline.state.steps) {
      const step = getStep(pipelineid, stepid);
      if (!step) {
        delete pipeline.state.steps[stepid]
        continue;
      }

      const meta = metadataFromStepScript(pipeline, step);
      if (meta.state == 'session') {
        delete pipeline.state.steps[stepid];
      }

      // serialize dataframes
      if (pipeline.state.steps[stepid]) {
        var state = pipeline.state.steps[stepid];

        Object.keys(state).forEach(name => {
          if (dataframe.isDataFrame(state[name])) {
            state[name] = dataframe.serialize(pipeline.state[name]);
          }
        });
      }
    }
  }

  return JSON.stringify(pipeline, null, padding === undefined ? 2 : padding);
}

export const load = (pipeline /*: pipeline */) /*: pipelineid */ => {
  var pipelineid = store.add(pipeline);

  // deserialize dataframes
  if (pipeline.state && pipeline.state.steps) {
    Object.keys(pipeline.state.steps).forEach(step => {
      var stepState = pipeline.state.steps[step];
      Object.keys(stepState).forEach(name => {
        if (name === 'cache' && stepState['cache'].result) {
          var stepResults = stepState['cache'].result;
          Object.keys(stepResults).forEach(name => {
            if (dataframe.isSerialized(stepResults[name])) {
              stepResults[name] = dataframe.deserialiaze(stepResults[name]);
            }
          });
        }
        else {
          if (dataframe.isSerialized(stepState[name])) {
            stepState[name] = dataframe.deserialiaze(stepState[name]);
          }
        }
      });
    });

    pipelinesState[pipelineid] = pipeline.state;
    pipelinesStateCount++;
  }

  return pipelineid;
}

export const getMaxId = (pipelineid /*: pipelineid */) /*: number */ => {
  var pipeline = store.get(pipelineid);
  
  var max = 0
  const maxid = (max, arr) => {
    const arrIds = arr.map(e => e.id);
    return Math.max(max, arrIds.length == 0 ? 0 : Math.max(...arrIds));
  }

  const paramIds = Object.keys(pipeline.params).map(e => parseInt(e));
  if (pipeline.params) max = !paramIds || paramIds.length == 0 ? 0 : Math.max(...paramIds);

  if (pipeline.steps) max = maxid(max, pipeline.steps);

  const scriptIds = Object.keys(pipeline.scripts).map(e => parseInt(e));
  if (pipeline.scripts) max = !scriptIds || scriptIds.length == 0 ? max : Math.max(...scriptIds);

  return max;
}

export const getGlobal = (pipelineid /*: pipelineid */, name /*: string */) => /*: Object */ {
  var pipeline = store.get(pipelineid);
  return pipeline.globals[name];
}

export const setGlobal = (pipelineid /*: pipelineid */, name /*: string */, data /*: Object */) => /*: void */ {
  var pipeline = store.get(pipelineid);
  pipeline.globals[name] = data;
}

const getGlobals = (pipeline /*: pipeline */) => /*: Object */ {
  return pipeline.globals;
}

export const getGlobalNames = (pipelineid /* pipelineid */) => /*: Array<string> */ {
  var pipeline = store.get(pipelineid);
  return Object.keys(pipeline.globals);
}

const setGlobals = (pipeline /*: pipeline */, globals /*: Object */ ) => {
  pipeline.globals = globals;
}

export const invalidateStep = (pipelineid /*: pipelineid */, sid /*: number */) => {
  const step = getStep(pipelineid, sid);
  step.invalidate = step.invalidate !== undefined ? step.invalidate + 1 : 1;
  updateStep(pipelineid, step);
}

export const getHtml = (pipelineid /* pipelineid */) /* string */ => {
  const libraryUrl = environment.getLibraryUrl();
  return `<script>
  var embedid = 'hal9' + (Math.floor(1000 * Math.random()));
  var host = document.createElement('div'); host.id = embedid; host.style = 'width: 100%; height: 100%; max-width: 100%; max-height: 100%;';
  document.currentScript.parentElement.appendChild(host);
  var hal9script = document.createElement('script');
  hal9script.setAttribute('src','${libraryUrl}');
  document.head.appendChild(hal9script);
  window.hal9 = { mode: 'embedded', id: embedid, pipeline: '` + btoa(unescape(encodeURIComponent(getSaveText(pipelineid, 0)))) + `' };
</script>`
}

export const updateMetadata = (pipelineid /*: pipelineid */, metadata /*: object */) /*: void */ => {
  var pipeline = store.get(pipelineid);
  pipeline.metadata = metadata;
}

export const getMetadata = (pipelineid /*: pipelineid */) /*: object */ => {
  var pipeline = store.get(pipelineid);
  return clone(pipeline.metadata);
}
