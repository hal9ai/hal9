import * as store from './pipelinestore.js';
import * as languages from './interpreters/languages'
import * as scripts from './scripts.js';
import * as snippets from './snippets';

const getLayout = (pipeline) => {
  return pipeline.layout;
}

const generateLayout = (pipeline) => {
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
    if (langInfo.html) hasHtml = true;

    if (hasHtml) {
      html = html + `<div class="hal9-step hal9-step-${step.id}${heightClass}" style="width: 100%; height: ${height}"></div>\n`;
    }
  }

  return html;
}

export const regenerateLayout = (pipelineid) => {
  var pipeline = store.get(pipelineid);
  pipeline.layout = generateLayout(pipeline);
}

export const prepareLayout = (pipeline, context, stepstopid) => {
  var parent = context.html;

  if (typeof (parent) === 'object') {
    const height = parent.offsetHeight;
    const html = parent.shadowRoot ? parent.shadowRoot : (context.shadow === false ? parent : parent.attachShadow({ mode: 'open' }));

    const isFullView = stepstopid === null || stepstopid === undefined;
    const layoutHTML = getLayout(pipeline);
    const hasLayout = !isFullView || layoutHTML;

    if (isFullView && hasLayout) {
      window.hal9 = window.hal9 ? window.hal9 : {};
      window.hal9.layouts = window.hal9.layouts ? window.hal9.layouts : {};

      if (window.hal9.layouts[pipeline.id] === layoutHTML) {
        const stepEls = html.querySelectorAll(':scope .hal9-step');
        [...stepEls].map(el => { el.innerHTML = '' });
      }
      else {
        parent.innerHTML = window.hal9.layouts[pipeline.id] = layoutHTML;
      }

      const inheritHeights = html.querySelectorAll(':scope .hal9-inherit-height');
      [...inheritHeights].map(container => { container.style.height = height + 'px' });
    }
    else {
      parent.innerHTML = html.innerHTML = '';
    }

    // add support for generating html blocks
    context.html = (step) => {
      var header = snippets.parseHeader(scripts.scriptFromStep(pipeline, step).script);
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