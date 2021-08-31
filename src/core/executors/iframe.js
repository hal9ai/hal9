import Executor from './definition';
import * as snippets from '../snippets';
import * as localparams from './params';
import * as interpreter from '../interpreters/interpreter';

import clone from '../utils/clone';
import * as datasets from '../datasets';

export default class IFrameExecutor extends Executor {
  async runStep() {
    if (!Object.keys(this.context).includes('html'))
      throw('Steps using \'iframe\' environment require \'html\' callback');

    const context = { html: html };
    var params = localparams.paramsForFunction(this.params, this.inputs, this.deps, context);

    params = localparams.fetchDatasets(params);

    const interpreted = interpreter.interpret(this.script, this.language);
    var funcBody = await snippets.getFunctionBody(interpreted, params);

    var html = this.context['html'](this.step);
   
    html.innerHTML = '';
    var iframe = document.createElement("iframe");
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '100%';

    var secret = Math.random();
    var content = `
      <script>
        async function runAsync(body, params) {
          params.html = () => document.body;
          var block = new Function("return " + body)();
          return await block(params);
        };

        window.addEventListener('message', event => {
          if (!event.data || event.data.secret != ${secret}) return;

          (async function() {
            const result = await runAsync(event.data.body, event.data.params);

            window.parent.postMessage({ secret: ${secret}, result: result, html: document.body.innerText > 0 }, '*');
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

        accept(event.data.result);
      };

      var responseListener = window.addEventListener('message', onResult);
    });

    params.html = params.hal9 = 'iframe';
    iframe.contentWindow.postMessage({ secret: secret, body: funcBody, params: params }, '*');
    var result = await waitResponse;

    /*
    if (this.callbacks && this.callbacks.onInvalidate) {
      this.callbacks.onInvalidate(Object.assign({}, this.params, this.inputs));
    }
    */

    return result;
  }
}
