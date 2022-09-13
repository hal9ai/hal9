import * as store from './pipelinestore.js';
import components from '../../scripts/components.json';
import clone from './utils/clone';
import * as pipelines from './pipelines.js';
import * as dataframe from './utils/dataframe';
import * as environment from './utils/environment'

export const getSaveText = (pipelineid /*: pipelineid */, padding /*:: : number */, alsoSkip = [] /*:: : Array<string> */) /*: string */ => {
  var from = store.get(pipelineid);
  var pipeline = {}

  const skip = [
    // no point in saving these because they're always recreated when running the pipeline
    'error',
    'errors',
    'globals',
    'layout',
    'outputs',
    'events',
  ];

  for (var key in from) {
    if (skip.includes(key) || alsoSkip.includes(key) || typeof(from[key]) == 'function') continue;
    pipeline[key] = clone(from[key]);
  }

  if (!(alsoSkip.includes('state'))) {
    pipeline.state = pipelines.getPipelineState(pipelineid);
  }

  if (pipeline.state) {
    for (var stepid in pipeline.state.steps) {
      const step = pipelines.getStep(pipelineid, stepid);
      if (!step) {
        delete pipeline.state.steps[stepid]
        continue;
      }

      const meta = pipelines.metadataFromStepScript(pipeline, step);
      if (meta.state == 'session') {
        delete pipeline.state.steps[stepid];
        continue;
      }

      if (pipeline.state.steps[stepid].events) {
        delete pipeline.state.steps[stepid].events;
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

const getHtmlCommon = (rawDefinitionRhs, appDimensions = undefined, setenvString = '') => {
  const libraryUrl = environment.getLibraryUrl();
  const applyAppLayoutString = (appDimensions ? ', applyAppLayout: true' : '');
  const widthString = appDimensions?.width ?? '600px';
  const heightString = appDimensions?.height ?? '400px';
  return `<script src="${libraryUrl}"></script>
<div id='hal9app' style="min-width: ${widthString}; min-height: ${heightString};"></div>
<script>${setenvString}
  (async function() {
    const raw = ${rawDefinitionRhs};
    hal9.run(await hal9.load(raw), { html: document.getElementById('hal9app')${applyAppLayoutString} });
  })();
</script>`;
}

export const getHtml = (pipelineid /* pipelineid */, appDimensions) /* string */ => {
  const rawDefinitionRhs = `'${btoa(unescape(encodeURIComponent(getSaveText(pipelineid, 0))))}'`;
  return getHtmlCommon(rawDefinitionRhs, appDimensions);
}

export const getHtmlRemote = (pipelinepath /* pipelinepath */, appDimensions) /* string */ => {
  const env = environment.getId();
  const setenv = env != 'prod' ? `\n    hal9.environment.setEnv('${env}');` : '';
  const rawDefinitionRhs = `await hal9.fetch('${pipelinepath}')`;
  return getHtmlCommon(rawDefinitionRhs, appDimensions, setenv);
}

const getFunctionForComponentName = (componentName) => {
  let componentForComponentName;
  for (const category in components) {
    componentForComponentName = components[category].find(component => (component.name === componentName));
    if (componentForComponentName) {
      break;
    }
  }
  return componentForComponentName?.function;
}

const getParametersForComponent = (step, params) => {
  const componentName = step.name;

  const fnparams = Object.keys(params).map(paramName => {
    const param = params[paramName];
    if (param.value.length > 0) {
      if (param.value[0].control == 'dataframe') {
        return param.name + ' = ' + param.value[0].source
      }
      else {
        const value = param.value[0].value ?? param.value[0].name;
        return param.name + ' = "' + value + '"'
      }
    }
    else
      return null;
  }).filter(e => e != null);

  return fnparams.join(', ');
}

export const getPythonScript = (pipelineid) => {
  const pipeline = store.get(pipelineid);
  let script = `# parameters not implemented yet
import hal9 as h9
h9.create()`;
  for (const step of pipeline.steps) {
    const functionName = step.function ?? getFunctionForComponentName(step.name);
    if (functionName) {
      script += '\n  .' + functionName + '()';
    } else {
      script += '\n  # missing function for step: ' + step.name;
    }
  }
  script += '\n  .show()';
  return script;
}

export const getRScript = (pipelineid) => {
  const pipeline = store.get(pipelineid);
  let script = `library(hal9)
h9_create()`;
  for (const step of pipeline.steps) {
    const functionName = step.function ?? getFunctionForComponentName(step.name);
    if (functionName) {
      const params = pipeline.params[step.id];
      script += ' |>\n  h9_' + functionName + '(' + getParametersForComponent(step, params) + ')';
    } else {
      script += ' |>\n  # missing function for step: ' + step.name;
    }
  }
  
  return script;
}