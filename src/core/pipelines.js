// @flow

import * as snippets from './snippets';
import * as operations from './utils/operations';
import * as dataframe from './utils/dataframe';
import clone from './utils/clone';
import * as environment from './utils/environment'

import * as executors from './executors/executors';

import * as store from './pipelinestore.js';
import * as api from './api.js';
import * as scripts from './scripts.js';
import * as layout from './layout.js';

import * as languages from './interpreters/languages'

import * as datatable from '../../libs/jedit/jedit.js';
import datatablecss from "../../libs/jedit/jedit.css";

import components from '../../scripts/components.json';

import { debugIf } from './utils/debug';

import * as datasets  from './datasets';

/*::
type paramid = number;
type param = { id: paramid, name: string, label: string, value: Array<Object> };
type params = { [key: string]: param };
type step = { id: number, name: string, language: string };
type stepid = number;
type steps = Array<step>;
type output = { id: number, name: string, label: string };
type outputs = { [string]: Array<output> };
type source = { id: number, name: string, label: string };
type sources = { [id: string]: source };
type context = { html: Object };
type pipeline = { params: params, steps: steps, sources: sources, ... };
type pipelineid = string;
type metadata = { params: params, deps: Array<string>, environment: string };
type block = { id: number, name: string, params: params, error: string, metadata: metadata, script: string };
type blocks = Array<block>;
type deps = { id: Array<id> };
*/

var pipelinesStateCount = 0;
var pipelinesState = {};
var pipelinesCallbacks = {};

export const getPipelineState = (pipelineid) => {
  return pipelinesState[pipelineid];
}

const paramsFromStep = (pipeline /* pipeline */, step /*: step */) /*: params */ => {
  if (pipeline.params[step.id]) return clone(pipeline.params[step.id]);
  return clone(paramsFromScript(scripts.scriptFromStep(pipeline, step).script));
}

const paramsFromScript = (script /*: string */) /*: params */ => {
  var codeparams = snippets.parseParams(script);

  var idx = 0;
  var retparams = Object.fromEntries(codeparams.map((e) => {
    if (typeof (e) === 'string')
      return [e, { id: idx++, name: e, label: e, static: false, value: [] }];
    else if (e === null)
      return ['', { id: idx++, static: false, value: [] }];
    else {
      if (e.value) {
        e.value.map(e => Object.assign(e, { id: idx++ }));
      }
      return [e.name, Object.assign({ id: idx++, static: !!e.value, value: [] }, e)]
    }
  }));

  return retparams;
}

const metadataFromScript = (script /*: string */) /* metadata */ => {
  var header = snippets.parseHeader(script);

  var id = 0;
  if (header.params) {
    header.params = header.params.map(e => {
      if (typeof (e) === 'string')
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

export const metadataFromStepScript = (pipeline /* pipeline */, step /*: step */) /* metadata */ => {
  return metadataFromScript(scripts.scriptFromStep(pipeline, step).script);
}

const createInt = (steps /*: steps */, previous /*: pipeline */) /*: pipeline */ => {
  steps = clone(steps);

  var newscripts = previous && previous.scripts ? previous.scripts : {},
    newscripts = Object.fromEntries(Object.entries(newscripts).filter(([k, v]) => steps.map(e => e.id.toString()).includes(k)));

  const pipeline = {
    id: previous.id ? previous.id : Math.floor(Math.random() * 10000000),
    steps: [],
    params: {},
    outputs: {},
    errors: {},
    scripts: newscripts,
    globals: {},
    error: undefined,
    version: '0.0.1',
    metadata: clone(previous.metadata),
    app: clone(previous.app),
    deps: {},
  };

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

export const runStep = async (pipelineid /*: pipeline */, sid /*: number */, context /* context */, partial) /*: boolean */ => {
  var pipeline = store.get(pipelineid);

  if (!context) context = {};
  if (!partial) partial = preparePartial(pipeline, context, partial, sid);
  if (pipeline.aborted) throw 'Pipeline stopped before finishing'

  const step = stepFromId(pipeline, sid);
  var result = {};

  var globals = getGlobalsInt(pipeline);
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

    let rebinds = step.options?.rebinds;

    var input = {}

    // assign only globals being used to prevent cache invalidations
    for (var inputidx in metadata.input) {
      const inputName = metadata.input[inputidx];
      input[inputName] = undefined;
      let globalToUse = inputName;
      if (rebinds?.inputs && (inputName in rebinds.inputs)) {
        globalToUse = rebinds.inputs[inputName];
      }
      if (typeof (globals[globalToUse]) !== 'undefined') input[inputName] = globals[globalToUse];
    }

    // upgrade old pipelines, can be removed eventually
    if (!pipeline.version) {
      for (var paramidx in metadata.params) {
        const param = metadata.params[paramidx];
        if (typeof (globals[param.name]) !== 'undefined') input[param.name] = globals[param.name];
      }
    }

    var params = pipeline.params[step.id] ? clone(pipeline.params[step.id]) : {};

    // add default parameters
    var paramsDefault = paramsFromScript(scripts.scriptFromStep(pipeline, step).script);
    Object.keys(paramsDefault).forEach(param => {
      if (!Object.keys(params).includes(param)) params[param] = clone(paramsDefault[param]);
    });

    if (context.params || context.manifest) {
      context.params = context.params ?? {};
      if (context.manifest && context.manifest[step.name]) {
        context.params = clone(context.manifest[step.name])
      }

      var paramIdx = Object.keys(params).length > 0 ? Math.max(...Object.keys(params).map(e => params[e].id ? params[e].id : 0)) : 0;
      Object.keys(context.params).forEach(param => {
        if (Object.keys(input).includes(param)) {
          console.log('Param ' + param + ' of type ' + typeof(input[param]) + ' matched with input in step ' + step.name + '/' + step.id)

          input[param] = clone(context.params[param]);
          delete context.params[param];
        }
        else if (Object.keys(params).includes(param)) {
          console.log('Param ' + param + ' of type ' + typeof(params[param]) + ' matched with param in step ' + step.name + '/' + step.id)

          params[param] = {
            id: paramIdx++, name: param, label: param, value: [{
              value: clone(context.params[param])
            }]
          };
          delete context.params[param];
        }
      });
    }

    if (rebinds?.params) {
      for (const param in rebinds.params) {
        if (param in params) {
          let newValue = input[rebinds.params[param]];
          if (newValue === undefined) {
            newValue = globals[rebinds.params[param]];
          }
          params[param].value = [
            {
              id: params[param].value?.[0]?.id ?? 0,
              value: newValue
            }
          ];
        }
      }
    }

    const deps = {};

    // add hal9 api to deps
    deps['hal9'] = api.create(pipelineid, sid, context, params, input);

    const script = scripts.scriptFromStep(pipeline, step);
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
      context.pipelinepath);

    result = await executor.runStep();

    // truncate data if needed
    if (result && result.data && Array.isArray(result.data) && context.maxRows && result.data.length && result.data.length > context.maxRows) {
      details.truncated = { truncation: context.maxRows };

      result.data.splice(context.maxRows);
      if (result.state && result.state.cache && result.state.cache.result && result.state.cache.result.data) {
        result.state.cache.result.data.splice(context.maxRows + 1);
      }
    }

    for (let resultname in result) {
      if (resultname === 'state') continue;

      const resultentry = result[resultname];

      if (rebinds?.outputs && (resultname in rebinds.outputs)) {
        resultname = rebinds.outputs[resultname];
      }

      resultNames.push(resultname);
      globals[resultname] = resultentry;
    }
  }
  catch (e) {
    console.log('Error in step ' + step.name + ': ' + e);
    console.log(e);
    error = e;
  }

  if (result.error) error = result.error;

  setErrors(pipeline, step.id, error);
  if (result.state) setState(pipelineid, step.id, Object.assign(state ? state : {}, result.state));
  setGlobals(pipeline, globals);

  let outputs = {};
  for (const resultName of resultNames) {
    outputs[resultName] = dataframe.columns(globals[resultName]).map((col, idx) => {
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

  var header = snippets.parseHeader(scripts.scriptFromStep(pipeline, step).script);
  return header && header.output && header.output.filter(e => e == 'html').length > 0;
}

const preparePartial = (pipeline, context, partial, renderid) => {
  if (!partial) partial = function() {};

  var html = context.html;
  if (typeof (html) === 'object') {
    const isFullView = renderid === null || renderid === undefined;

    const hasSteps = pipeline.steps.length > 0;
    const oneHasHtml = pipeline.steps.map(step => stepHasHtml(pipeline, step)).filter(e => e).length > 0;
    
    // add support for viewing data tables
    if ((!isFullView || !oneHasHtml) && hasSteps) {
      if (!oneHasHtml) {
        renderid = pipeline.steps[pipeline.steps.length - 1].id;
      }

      var step = stepFromId(pipeline, renderid);
      var header = snippets.parseHeader(scripts.scriptFromStep(pipeline, step).script);
      const hasHtml = stepHasHtml(pipeline, step);
      if (!hasHtml) {
        return function (pipeline, step, result, error, details) {
          html = html.shadowRoot ? html.shadowRoot : html;
          html.innerHTML = '';

          var style = document.createElement('style');
          style.innerHTML = datatablecss;
          style.id = 'hal9__datatable__style';
          html.appendChild(style);

          var area = document.createElement('div');
          area.style.width = area.style.maxWidth = "100%";
          area.style.overflow = 'hidden';

          var tabs = document.createElement('div');
          tabs.style.width = tabs.style.maxWidth = "100%";
          tabs.style.overflow = 'hidden';

          tabs.style.display = 'flex';
          tabs.style.flexDirection = 'row';
          html.appendChild(tabs);
          if (Object.keys(result).length > 1) {
            Object.keys(result).forEach((r, tabIdx) => {
              var tab = document.createElement('a');
              tab.href = '#';
              tab.target = '_self';
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

const skipStep = (pipeline, step) => {
  if (typeof (window) == 'undefined') {
    // can't execute HTML blocks in nodejs
    if (stepHasHtml(pipeline, step)) return true;
  }

  return false;
}

export const run = async (pipelineid /*: pipelineid */, context /* context */, partial, stepstopid /* stepid */) /*: void */ => {
  debugIf('run');

  if (!context) context = {};
  context.events?.onStart();

  var pipeline = store.get(pipelineid);
  pipeline.aborted = undefined;

  await scripts.fetchScripts(pipeline.steps);

  if (typeof (context.html) === 'string') {
    context.html = document.getElementById(context.html);
  }
  const appDiv = context.html;

  partial = preparePartial(pipeline, context, partial, stepstopid);
  layout.prepareForDocumentView(pipeline, context, stepstopid);

  pipeline.errors = {};
  pipeline.error = undefined;
  setGlobals(pipeline, {});
  pipeline.outputs = {};

  // add context parameters
  if (typeof (window) != 'undefined' && window.hal9 && window.hal9.params) {
    console.log('Pipeline contains parameters: ' + Object.keys(window.hal9.params))
    context.params = window.hal9.params;
  }

  for (var idx = 0; idx < pipeline.steps.length; idx++) {
    const step = pipeline.steps[idx];
    if (skipStep(pipeline, step)) continue;

    const success = await runStep(pipelineid, step.id, context, partial);

    if (!success) {
      pipeline.error = pipeline.errors[step.id];
      break;
    }

    if (stepstopid != undefined && step.id === stepstopid) break;
    if (context.stopped === true) break;
  };

  if (context.applyAppLayout) {
    delete context.applyAppLayout;
    const outputDiv = appDiv.shadowRoot;
    layout.setHal9StepOverflowProperty('hidden', outputDiv);
    layout.applyStepLayoutsToApp(pipeline.app.stepLayouts, outputDiv);
  }

  context.events?.onError(clone(pipeline.error));
  context.events?.onEnd(clone(pipeline.globals), getStepsWithHeaders(pipelineid));

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

const mergeParam = (pipelineid /*: pipelineid */, sid /*: stepid */, pid /*: paramid */, field /*: Object */) /*: void */ => {
  var pipeline = store.get(pipelineid);

  field = clone(field);
  var pname = paramNameFromId(pipeline, sid, pid);
  var value = pipeline.params[sid][pname].value;
  const valueIdx = value.length == 1 ? 0 : value.findIndex(x => x.id == field.id);

  if (field.sid !== undefined) delete field.sid;
  if (field.pid !== undefined) delete field.pid;
  pipeline.params[sid][pname].value[valueIdx] = field;
}

const updateParamField = (pipelineid /*: pipelineid */, sid /*: stepid */, param /*: string */, fidx /* number */, update /*: param */) => {
  var pipeline = store.get(pipelineid);
  pipeline.params[sid][param].value[fidx] = Object.assign(pipeline.params[sid][param].value[fidx], update);
}

const getFields = (pipelineid /*: pipelineid */) => {
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

const getStepHeader = (pipeline, step) => {
  return snippets.parseHeader(scripts.scriptFromStep(pipeline, step).script);
}

export const getSteps = (pipelineid /*: pipelineid */) /*: steps */ => {
  var pipeline = store.get(pipelineid);
  return clone(pipeline.steps);
}

export const getStepsWithHeaders = (pipelineid /*: pipelineid */) /*: steps */ => {
  var pipeline = store.get(pipelineid);
  var steps = clone(pipeline.steps);

  steps.map(step => {
    step.header = getStepHeader(pipeline, step);
  })

  return steps;
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
  if (typeof (step.id) === 'undefined' || step.id <= maxId) {
    step.id = maxId + 1;
  }

  // avoid overlaping with library scripts defined in pipeline.vue
  if (step.id < 10000) {
    step.id = step.id + 10000
  }

  if (step.id < maxId) {
    step.id = maxId + 1;
  }

  if (typeof (step.name) === 'undefined') {
    step.name = 'unnamed';
  }

  if (typeof (step.label) === 'undefined') {
    step.label = step.name;
  }

  var params = paramsFromStep(pipeline, step);
  step.params = params;

  if (step.params) {
    pipeline.params[step.id] = step.params;
  }

  const scriptInfo = scripts.scriptFromStep(pipeline, step);
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
    pipeline.steps[index] = step;
  }

  return step;
}

export const getNested = (pipelineid /*: pipelineid */) /*: blocks */ => {
  var pipeline = store.get(pipelineid);
  return clone(
    pipeline.steps.map(step => {
      const script = scripts.scriptFromStep(pipeline, step);
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

const getDefinition = (pipeline /*: pipeline */) /*: object */ => {
  const stepDefinitions = clone(pipeline.steps.map(step => stepGetDefinition(pipeline, step)));
  return {
    steps: stepDefinitions,
    app: clone(pipeline.app)
  }
}

const setOutputs = (pipeline /*: pipeline */, sid /*: number */, outputs /*: outputs */) /*: void */ => {
  if (!pipeline.outputs) pipeline.outputs = {};
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

export const getRebindablesForStep = (pipelineid, step) => {
  const pipeline = store.get(pipelineid);
  const metadata = metadataFromStepScript(pipeline, step);
  return {
    inputs: (metadata.invalid ? [] : [...(metadata.input)]),
    outputs: (metadata.invalid ? [] : [...(metadata.output)]),
    params: (metadata.invalid ? [] : metadata.params.map(param => param.name))
  };
}

const prevStep = (pipelineid /*: pipelineid */, sid /*: number */) /* step */ => {
  var pipeline = store.get(pipelineid);
  return clone(stepFromId(pipeline, sid, -1));
}

export const getSources = (pipelineid /*: pipelineid */, sid /*: number */) /*: sources */ => {
  var pipeline = store.get(pipelineid);
  const outputName = stepFromId(pipeline, sid)?.options?.rebinds?.inputs?.data ?? 'data';

  var prev = null;
  var previd = sid;

  // search backwards for the block that has the output we're looking for
  do {
    prev = prevStep(pipelineid, previd);
    if (prev != null) previd = prev.id;
  } while ((prev != null) && (pipeline.outputs[previd]?.[outputName] === undefined))

  return prev ? (pipeline.outputs[previd]?.[outputName] ? clone(pipeline.outputs[previd][outputName]) : undefined) : undefined;
}

const setErrors = (pipeline /*: pipeline */, sid /*: number */, error /*: string */) /*: void */ => {
  if (!pipeline.errors) pipeline.errors = {};
  pipeline.errors[sid] = error;
}

export const getStepError = (pipelineid /*: pipelineid */, sid /*: number */) /*: string */ => {
  var pipeline = store.get(pipelineid);
  return clone(pipeline.errors[sid]);
}

export const setScript = (pipelineid /*: pipelineid */, sid /*: number */, script /*: string */) /*: void */ => {
  var pipeline = store.get(pipelineid);
  const step = stepFromId(pipeline, sid);

  const oldscript = scripts.scriptFromStep(pipeline, step).script;
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
  return scripts.scriptFromStep(pipeline, step).script;
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

const clearState = (pipelineid /*: pipelineid */) /*: void */ => {
  pipelinesState[pipelineid] = { steps: {} };
  pipelinesStateCount++;
}

export const setCallback = (pipelineid /*: pipelineid */, sid /*: number */, name /* string */, callback /*: Object */) /*: void */ => {
  if (!pipelinesCallbacks[pipelineid]) pipelinesCallbacks[pipelineid] = { steps: {} };
  if (!pipelinesCallbacks[pipelineid].steps[sid]) pipelinesCallbacks[pipelineid].steps[sid] = {}
  pipelinesCallbacks[pipelineid].steps[sid][name] = callback;
}

const getCallback = (pipelineid /*: pipelineid */, sid /*: number */) /*: Object */ => {
  if (!pipelinesCallbacks[pipelineid]) return null;
  if (!pipelinesCallbacks[pipelineid].steps[sid]) return null;
  return pipelinesCallbacks[pipelineid].steps[sid][name];
}

const getCallbacks = (pipelineid /*: pipelineid */, sid /*: number */) /*: Object */ => {
  if (!pipelinesCallbacks[pipelineid]) return {};
  if (!pipelinesCallbacks[pipelineid].steps[sid]) return {};
  return pipelinesCallbacks[pipelineid].steps[sid];
}

export const load = async (pipeline /*: pipeline */) /*: pipelineid */ => {
  
  // validate steps and transfer dataframes
  for (var idx = 0; idx < pipeline.steps.length; idx++) {
    const step = pipeline.steps[idx];
    const params = pipeline.params[step.id];

    if (params) {
      for (const param of Object.keys(params)) {
        if (params[param].value?.[0]?.control == 'dataframe') {
          params[param].value[0].value = datasets.save(params[param].value[0].value);
        }
      }
    }
  }

  var pipelineid = store.add(pipeline);

  // deserialize dataframes
  if (pipeline.state && pipeline.state.steps) {
    for (const step of Object.keys(pipeline.state.steps)) {
      var stepState = pipeline.state.steps[step];
      for (const name of Object.keys(stepState)) {
        if (name === 'cache' && stepState['cache'].result) {
          var stepResults = stepState['cache'].result;
          for (const name of Object.keys(stepResults)) {
            if (await dataframe.isSerialized(stepResults[name])) {
              stepResults[name] = await dataframe.deserialize(stepResults[name]);
            }
          };
        }
        else if (name === 'api') {
          for (const apiname of Object.keys(stepState['api'])) {
            if (await dataframe.isSerialized(stepState['api'][apiname])) {
              stepState['api'][apiname] = await dataframe.deserialize(stepState['api'][apiname]);
            }
          };
        }
        else {
          if (await dataframe.isSerialized(stepState[name])) {
            stepState[name] = await dataframe.deserialize(stepState[name]);
          }
        }
      };
    };

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
  if (pipeline.scripts) max = !scriptIds || scriptIds.length == 0 ? max : Math.max(max, Math.max(...scriptIds));

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

const getGlobalsInt = (pipeline /*: pipeline */) => /*: Object */ {
  return pipeline.globals ?? {};
}

export const getGlobals = (pipelineid /*: pipelineid */) => /*: Object */ {
  var pipeline = store.get(pipelineid);
  return getGlobalsInt(pipeline);
}

export const getGlobalNames = (pipelineid /* pipelineid */) => /*: Array<string> */ {
  var pipeline = store.get(pipelineid);
  return Object.keys(pipeline.globals);
}

const setGlobals = (pipeline /*: pipeline */, globals /*: Object */) => {
  pipeline.globals = globals;
}

export const invalidateStep = (pipelineid /*: pipelineid */, sid /*: number */) => {
  const step = getStep(pipelineid, sid);
  step.invalidate = step.invalidate !== undefined ? step.invalidate + 1 : 1;
  updateStep(pipelineid, step);
}

export const setMetadataProperty = (pipelineid /*: pipelineid */, name /*: string */, value /*: mixed */) /*: void */ => {
  var pipeline = store.get(pipelineid);
  if (!(pipeline.metadata)) {
    pipeline.metadata = {};
  }
  pipeline.metadata[name] = clone(value);
}

export const getMetadata = (pipelineid /*: pipelineid */) /*: object */ => {
  var pipeline = store.get(pipelineid);
  return clone(pipeline.metadata);
}

export const setAppProperty = (pipelineid /*: pipelineid */, name /*: string */, value /*: mixed */) /*: void */ => {
  var pipeline = store.get(pipelineid);
  if (!(pipeline.app)) {
    pipeline.app = {};
  }
  pipeline.app[name] = clone(value);
}

export const getApp = (pipelineid /*: pipelineid */) /*: object */ => {
  var pipeline = store.get(pipelineid);
  return clone(pipeline.app);
}

export const abort = async (pipelineid /*: pipelineid */) /*: void */ => {
  var pipeline = store.get(pipelineid);
  pipeline.aborted = true;
}

export const isAborted = async (pipelineid /*: pipelineid */) /*: boolean */ => {
  var pipeline = store.get(pipelineid);
  return pipeline.aborted === true;
}

export const getDependencies = async (pipelineid /*: pipelineid */) /*: deps */ => {
  var pipeline = store.get(pipelineid);
  return clone(pipeline.deps);
}

