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
    const headerLayoutWidth = header?.layout?.[0]?.width;
    const headerLayoutHeight = header?.layout?.[0]?.height;
    // "ali" is "app layout initial"
    const appLayoutInitialWidthClass = (headerLayoutWidth ? (' hal9-ali-width-' + headerLayoutWidth) : '');
    const appLayoutInitialHeightClass = (headerLayoutHeight ? (' hal9-ali-height-' + headerLayoutHeight) : '');
    if (langInfo.html) hasHtml = true;

    if (hasHtml) {
      html = html + `<div class="hal9-step hal9-step-${step.id}${heightClass}${interactiveClass}${appLayoutInitialWidthClass}${appLayoutInitialHeightClass}" style="position: relative; width: 100%; height: ${height}"></div>\n`;
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
    else if (parent.dataset.keepContents === undefined) {
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
        container.style.position = 'relative';
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
        container.style.position = 'relative';
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
const outputSelector = ':root>body>#output';
const hal9StepSelector = ':scope>.hal9-step';
const hal9StepSelectorForShadowRoot = ':host>.hal9-step';
let iframeAlertShown = false;

const getOutputDiv = () => {
  const outputDiv = document.querySelector(outputSelector);
  if (!outputDiv) {
    const errorMessage = `Error: can't find output div in iframe`;
    if (!iframeAlertShown) {
      alert(errorMessage);
      iframeAlertShown = true;
    }
    console.log(errorMessage);
  }
  return outputDiv;
}

const getHal9Steps = (outputDiv) => {
  let selector = hal9StepSelector;
  if (outputDiv === undefined) {
    outputDiv = getOutputDiv();
  } else if (outputDiv === outputDiv.getRootNode()) {
    selector = hal9StepSelectorForShadowRoot;
  }
  return outputDiv.querySelectorAll(selector);
}

const getHal9StepById = (stepId, outputDiv) => {
  let selector = hal9StepSelector + '-' + stepId;
  if (outputDiv === undefined) {
    outputDiv = getOutputDiv();
  } else if (outputDiv === outputDiv.getRootNode()) {
    selector = hal9StepSelectorForShadowRoot + '-' + stepId;
  }
  return outputDiv.querySelector(selector);
}

const getClassSuffixForPrefix = (classList, prefix) => {
  for (const className of classList) {
    if (className.startsWith(prefix)) {
      return className.slice(prefix.length);
    }
  }
  return null;
}

export const storeAppStepLayouts = (pipelineid) => {
  const hal9Steps = getHal9Steps();
  let stepLayouts = [...hal9Steps].map(hal9Step => {
    let stepLayout = {};
    stepLayout.stepId = parseInt(getClassSuffixForPrefix(hal9Step.classList, 'hal9-step-'));
    if (hal9Step.style.overflow !== 'hidden') {
      console.log(`Warning: calculating app layout depends on all steps having 'overflow' set to 'hidden'`);
    }
    let widthToUse = hal9Step.offsetWidth + 'px';
    let heightToUse = hal9Step.offsetHeight + 'px';
    if (hal9Step.style.width === '100%') {
      // app layout hasn't been set yet for this control
      const requestedWidth = getClassSuffixForPrefix(hal9Step.classList, 'hal9-ali-width-');
      if (requestedWidth === 'inner') {
        // find the first descendant that has less width than the entire step
        let element = hal9Step.firstElementChild;
        while (element) {
          if (element.offsetWidth === 0) {
            element = element.nextElementSibling;
          } else if (element.offsetWidth === hal9Step.offsetWidth) {
            element = element.firstElementChild;
          } else {
            break;
          }
        }
        if (element && (element.offsetWidth > 0)) {
          widthToUse = element.offsetWidth + 'px';
          heightToUse = element.offsetHeight + 'px';
        }
      } else if (requestedWidth) {
        widthToUse = requestedWidth;
        heightToUse = hal9Step.offsetHeight + 'px';
      }

      const requestedHeight = getClassSuffixForPrefix(hal9Step.classList, 'hal9-ali-height-');
      if (requestedHeight) {
        heightToUse = requestedHeight;
      }
    }
    stepLayout.width = widthToUse;
    stepLayout.left = hal9Step.offsetLeft + 'px';
    stepLayout.height = heightToUse;
    stepLayout.top = hal9Step.offsetTop + 'px';
    return stepLayout;
  });
  pipelines.setAppProperty(pipelineid, 'stepLayouts', stepLayouts);
}

export const applyStepLayoutsToApp = (stepLayouts, outputDiv) => {
  for (const stepLayout of stepLayouts) {
    const hal9Step = getHal9StepById(stepLayout.stepId, outputDiv);
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

export const removeLayout = (outputDiv) => {
  const hal9Steps = getHal9Steps(outputDiv);
  for (const hal9Step of hal9Steps) {
    hal9Step.classList.remove('hal9-inherit-height');
    hal9Step.removeAttribute('style');
  }
}

export const calcAppDimensions = (stepLayouts) => {
  const appDimensions = {
    width: 0,
    height: 0
  }
  for (const stepLayout of stepLayouts) {
    const right = parseInt(stepLayout.left) + parseInt(stepLayout.width);
    if (right > appDimensions.width) {
      appDimensions.width = right;
    }
    const bottom = parseInt(stepLayout.top) + parseInt(stepLayout.height);
    if (bottom > appDimensions.height) {
      appDimensions.height = bottom;
    }
  }
  appDimensions.width += 'px';
  appDimensions.height += 'px';
  return appDimensions;
}

export const setHal9StepOverflowProperty = (overflowValue, outputDiv) => {
  const hal9Steps = getHal9Steps(outputDiv);
  for (const hal9Step of hal9Steps) {
    if (overflowValue) {
      hal9Step.style.overflow = overflowValue;
    } else {
      hal9Step.style.removeProperty('overflow');
    }
  }
}
