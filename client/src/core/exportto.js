import components from '../../scripts/components.json';
import clone from './utils/clone';
import * as layout from './layout';
import * as pipelines from './pipelines';
import * as store from './pipelinestore';
import * as dataframe from './utils/dataframe';
import * as environment from './utils/environment'

import indentString from 'indent-string';

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

/*
getHtml parameters
pipelineid: required
pipelinepath: optional, will be referenced in the export if given
htmlFormat: 3 string choices
  1. 'embedCompact' for compact embed (HTML and style inserted at runtime)
  2. 'embedStyle' for embed with customizable style (HTML inserted at runtime)
  3. 'complete' for complete HTML page with rearrangable HTML and customizable style
appDivId: id of app div; optional, will be 'hal9app' if not provided
*/
export const getHtml = (pipelineid, pipelinepath, htmlFormat, appDivId) => {
  let generateStyle;
  let fullPage;
  switch (htmlFormat) {
    case 'embedCompact':
      generateStyle = false;
      fullPage = false;
      break;
    case 'embedStyle':
      generateStyle = true;
      fullPage = false;
      break;
    case 'complete':
      generateStyle = true;
      fullPage = true;
      break;
    default:
      throw new Error('getHtml: Unknown htmlFormat');
  }
  const hal9LibraryScriptElementString = `<script src="${environment.getLibraryUrl()}"></script>`;
  let setEnvString = '';
  let rawDefinitionRhs;
  if (pipelinepath) {
    const env = environment.getId();
    if (env !== 'prod') {
      setEnvString = `\n  hal9.environment.setEnv('${env}');`;
    }
    rawDefinitionRhs = `await hal9.fetch('${pipelinepath}')`;
  } else {
    rawDefinitionRhs = `'${btoa(unescape(encodeURIComponent(getSaveText(pipelineid, 0))))}'`;
  }

  const pipelineMetadata = pipelines.getMetadata(pipelineid);
  const appMode = (pipelineMetadata?.defaultMode === 'app');
  let appDimensions;
  let stepLayouts;
  if (appMode) {
    stepLayouts = pipelines.getApp(pipelineid).stepLayouts;
    appDimensions = layout.calcAppDimensions(stepLayouts);
  }
  const applyAppLayoutString = ((appMode && !generateStyle) ? ', applyAppLayout: true' : '');
  const widthString = appDimensions?.width ?? '600px';
  const heightString = appDimensions?.height ?? '400px';

  appDivId = appDivId ?? 'hal9app';
  const appStyleId = appDivId + '-style';

  let styleElementString = '';
  let stylePropertyString = '';
  if (generateStyle) {
    styleElementString = `<style id="${appStyleId}">`;
    if (fullPage) {
      styleElementString += `
  #${appDivId} {
    min-width: ${widthString};
    min-height: ${heightString};
  }`;
    }
    styleElementString += `
  .hal9-step {
    position: absolute;
    overflow: hidden;
  }`;
    for (const stepLayout of stepLayouts) {
      const step = pipelines.getStep(pipelineid, stepLayout.stepId);
      const stepComment = '\n    /* ' + step.name + ' */';
      styleElementString += `
  .hal9-step-${stepLayout.stepId} {${stepComment}
    width: ${stepLayout.width};
    left: ${stepLayout.left};
    height: ${stepLayout.height};
    top: ${stepLayout.top};
  }`;
    }
    styleElementString += '\n</style>';
    stylePropertyString = `, style: '${appStyleId}'`;
  }

  const runtimeScriptElementString = `<script>${setEnvString}
  (async function() {
    const raw = ${rawDefinitionRhs};
    hal9.run(await hal9.load(raw), { html: '${appDivId}'${applyAppLayoutString}${stylePropertyString} });
  })();
</script>`;

  if (fullPage) {
    let appDivElementString = `<div id="${appDivId}" data-keep-contents>`;
    for (const stepLayout of stepLayouts) {
      appDivElementString += '\n' + `  <div class="hal9-step hal9-step-${stepLayout.stepId}"></div>`;
    }
    appDivElementString += '\n</div>';
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Powered by Hal9</title>
${indentString(hal9LibraryScriptElementString, 4)}
${indentString(styleElementString, 4)}
  </head>
  <body>
${indentString(appDivElementString, 4)}
${indentString(runtimeScriptElementString, 4)}
  </body>
</html>`;
  }

  return `${hal9LibraryScriptElementString}
<div id="${appDivId}" style="min-width: ${widthString}; min-height: ${heightString};"></div>${'\n' + styleElementString}
${runtimeScriptElementString}`;
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