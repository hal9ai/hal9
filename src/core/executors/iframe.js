import Executor from './definition';
import * as snippets from '../snippets';
import * as localparams from './params';
import * as interpreter from '../interpreters/interpreter';

import clone from '../utils/clone';
import * as datasets from '../datasets';

import * as dataframe from '../utils/dataframe';

export default class IFrameExecutor extends Executor {
  async runStep() {
    if (!Object.keys(this.context).includes('html'))
      throw('Steps using \'iframe\' environment require \'html\' callback');

    const context = { html: html };
    var params = localparams.paramsForFunction(this.params, this.inputs, {}, context);

    params = localparams.fetchDatasets(params);

    const interpreted = interpreter.interpret(this.script, this.language);
    var funcBody = await snippets.getFunctionBody(interpreted, params, true);
    const header = snippets.parseHeader(interpreted);

    var html = this.context['html'](this.step);
   
    html.innerHTML = '';
    var iframe = document.createElement("iframe");
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '100%';


    var deps = '<!-- No Hal9 dependencies -->';
    if (header.deps) deps = header.deps.map(dep => `      <script src='${dep}'></script>`).join('\n');

    var secret = Math.random();
    var content = `
      ${deps}
      <script>
        async function runAsync(body, params) {
          params.html = document.body;
          var block = new Function("return " + body)();
          return await block(params);
        };

        function postError(message, url, line) {
          const error = { message: message, url: url, line: line }
          window.parent.postMessage({ secret: ${secret}, error: error }, '*');
        }

        window.onerror = function (message, url, line) {
          postError(message, url, line);
        }

        window.addEventListener('message', event => {
          if (!event.data || event.data.secret != ${secret}) return;

          (async function() {
            try {
              const result = await runAsync(event.data.body, event.data.params);

              window.parent.postMessage({ secret: ${secret}, result: result, html: document.body.innerText.length > 0 }, '*');
            }
            catch(e) {
              postError(e.message);
            }
          })();
        }); 
      </script>
      <body></body>
    `;

    iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(content);

    var waitLoad = new Promise((accept, reject) => {
      iframe.addEventListener('load', accept);
      iframe.addEventListener('error', reject);
    });
    html.appendChild(iframe);
    await waitLoad;

    var waitResponse = new Promise((accept, reject) => {
      var onResult = function(e) {
        if (!event.data || event.data.secret != secret) return;

        window.removeEventListener('message', onResult);

        if (!event.data.html) iframe.remove();

        if (event.data.error) {
          reject(event.data.error);
          return;
        }

        accept(event.data.result);
      };

      var responseListener = window.addEventListener('message', onResult);
    });

    params.html = params.hal9 = 'iframe';
    iframe.contentWindow.postMessage({ secret: secret, body: funcBody, params: params }, '*');
    var result = await waitResponse;

    // data frames can loose their prototype functions when crossing the iframe boundary
    Object.keys(result).forEach(key => {
      if (dataframe.isDataFrame(result[key])) {
        result[key] = dataframe.ensure(result[key]);
      }
    })

    /*
    if (this.callbacks && this.callbacks.onInvalidate) {
      this.callbacks.onInvalidate(Object.assign({}, this.params, this.inputs));
    }
    */

    return result;
  }
}
