import * as htmloutput from './htmloutput';
import * as languages from './interpreters/languages'
import * as pipelines from './pipelines';
import * as scripts from './scripts';
import * as snippets from './snippets';
import * as store from './pipelinestore';

const getForDocumentView = (pipeline) => {
  return pipeline.layout;
}

const generateForDocumentView = (pipeline) => {
  var html = ''

  for (let step of pipeline.steps) {
    const langInfo = languages.getLanguageInfo(step.language);

    var height = 'auto';
    var heightClass = '';

    if (langInfo.height) {
      height = langInfo.height;
    }
    else {
      heightClass = ' hal9-inherit-height';
    }

    var header = snippets.parseHeader(scripts.scriptFromStep(pipeline, step).script);
    var hasHtml = header && header.output && header.output.filter(e => e == 'html').length > 0;
    var interactiveClass = header && header.interactive ? ' hal9-interactive' : '';
    if (langInfo.html) hasHtml = true;

    if (hasHtml) {
      html = html + `<div class="hal9-step hal9-step-${step.id}${heightClass}${interactiveClass}" style="width: 100%; height: ${height}"></div>\n`;
    }
  }

  return html;
}

export const regenerateForDocumentView = (pipelineid, removeOldLayout) => {
  var pipeline = store.get(pipelineid);
  pipeline.layout = generateForDocumentView(pipeline);
  if (pipeline.steps.length === 0) {
    removeOldLayout = true;
    htmloutput.clear();
  }
  if (removeOldLayout) {
    if (window.hal9?.layouts?.[pipeline.id]) {
      window.hal9.layouts[pipeline.id] = undefined;
    }
  }
}

const sandboxIfNeeded = (html) => {
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

export const prepareForDocumentView = (pipeline, context, stepstopid) => {
  var parent = context.html;

  if (typeof (parent) === 'object') {
    window.hal9 = window.hal9 ? window.hal9 : {};
    window.hal9.layouts = window.hal9.layouts ? window.hal9.layouts : {};
      
    const height = parent.offsetHeight;
    const html = parent.shadowRoot ? parent.shadowRoot : (context.shadow === false ? parent : parent.attachShadow({ mode: 'open' }));

    const isFullView = stepstopid === null || stepstopid === undefined;
    const layoutHTML = getForDocumentView(pipeline);
    const hasLayout = !isFullView || layoutHTML;

    if (isFullView && hasLayout) {
      if (window.hal9.layouts[pipeline.id] === layoutHTML) {
        const stepEls = html.querySelectorAll(':scope .hal9-step');
        [...stepEls].map(el => {
          if (el.classList.contains('hal9-interactive') && (context.siteMode !== 'layout')) {
            // interactive elements are not erased but rather handle interactions themselves
          }
          else {
            el.innerHTML = '';
          }
        });
      }
      else {
        parent.innerHTML = window.hal9.layouts[pipeline.id] = layoutHTML;
      }

      const inheritHeights = html.querySelectorAll(':scope .hal9-inherit-height');
      [...inheritHeights].map(container => { container.style.height = height + 'px' });
    }
    else {
      window.hal9.layouts[pipeline.id] = undefined;
      parent.innerHTML = html.innerHTML = '';
    }

    // add support for generating html blocks
    context.html = (step) => {
      var header = snippets.parseHeader(scripts.scriptFromStep(pipeline, step).script);
      var hasHtml = header && header.output && header.output.filter(e => e == 'html').length > 0;

      const langInfo = languages.getLanguageInfo(step.language);
      if (langInfo.html) hasHtml = true;

      const output = html.querySelector(':scope .hal9-step-' + step.id);
      const interactiveClass = header.interactive ? ' hal9-interactive' : '';
      if (isFullView && output && !(output.classList.contains('hal9-interactive') && (context.siteMode !== 'layout'))) {
        output.innerHTML = '';
      }

      if (isFullView && hasLayout) {
        if (output) return output;

        return sandboxIfNeeded(html);
      }
      else if (isFullView && hasHtml) {
        if (output) return output;

        var container = document.createElement('div');

        container.className = 'hal9-step hal9-step-' + step.id + interactiveClass;
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
        if (output) return output;

        var container = document.createElement('div');
        container.className = 'hal9-step hal9-step-' + step.id + interactiveClass;
        container.style.width = '100%';
        container.style.height = '100%';

        html.appendChild(container);

        return container;
      }
      else {
        return sandboxIfNeeded(html);
      }
    }
  }
}

// be very specific, in case someone put id="output" or class="hal9-step" in their block script
const hal9StepSelector = ':root>body>#output>.hal9-step';

const getHal9Steps = () => {
  return document.querySelectorAll(hal9StepSelector);
}

const getHal9StepById = (stepId) => {
  return document.querySelector(hal9StepSelector + '-' + stepId);
}

export const storeAppStepLayouts = (pipelineid) => {
  const hal9Steps = getHal9Steps();
  let stepLayouts = [...hal9Steps].map(hal9Step => {
    let stepLayout = {};
    for (const className of hal9Step.classList) {
      if (className.startsWith('hal9-step-')) {
        stepLayout.stepId = parseInt(className.slice(10));
        break;
      }
    }
    if (hal9Step.style.overflow !== 'hidden') {
      console.log(`Warning: calculating app layout depends on all steps having 'overflow' set to 'hidden'`);
    }
    stepLayout.width = hal9Step.offsetWidth + 'px';
    stepLayout.left = hal9Step.offsetLeft + 'px';
    stepLayout.height = hal9Step.offsetHeight + 'px';
    stepLayout.top = hal9Step.offsetTop + 'px';
    return stepLayout;
  });
  pipelines.setAppProperty(pipelineid, 'stepLayouts', stepLayouts);
}

export const applyStepLayoutsToApp = (stepLayouts) => {
  for (const stepLayout of stepLayouts) {
    const hal9Step = getHal9StepById(stepLayout.stepId);
    if (!hal9Step) {
      // a step previously in the layout was removed
      continue;
    }
    hal9Step.classList.remove('hal9-inherit-height');
    hal9Step.style.position = 'absolute';
    hal9Step.style.width = stepLayout.width;
    hal9Step.style.left = stepLayout.left;
    hal9Step.style.height = stepLayout.height;
    hal9Step.style.top = stepLayout.top;
  }
}

export const setHal9StepOverflowProperty = (overflowValue) => {
  const hal9Steps = getHal9Steps();
  for (const hal9Step of hal9Steps) {
    if (overflowValue) {
      hal9Step.style.overflow = overflowValue;
    } else {
      hal9Step.style.removeProperty('overflow');
    }
  }
}
