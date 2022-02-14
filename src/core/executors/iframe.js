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

    var params = localparams.paramsForFunction(this.params, this.inputs, {});
    const hal9api = this.deps.hal9;

    params = localparams.fetchDatasets(params);

    const interpreted = interpreter.interpret(this.script, this.language, this.context);
    const script = `
      var html = document.body;
    ` + interpreted.script;

    var funcBody = await snippets.getFunctionBody(script, params, true);
    const header = snippets.parseHeader(this.script);
    header.deps.push(...(interpreted.header.deps ? interpreted.header.deps : []));

    var html = this.context['html'](this.step);
   
    html.innerHTML = '';
    var iframe = document.createElement("iframe");
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '100%';

    iframe.setAttribute('sandbox', 'allow-scripts');

    var deps = '<!-- No Hal9 dependencies -->';
    if (header.deps) deps = header.deps.map(dep => `      <script src='${dep}'></script>`).join('\n');

    var secret = Math.random();
    var content = `
      ${deps}
      <script>
        async function runAsync(body, params) {
          params.html = document.body;
          params.hal9 = {
            setResult: (r) => {
              window.parent.postMessage({ secret: ${secret}, result: r, html: document.body.innerText.length > 0, invalidate: true }, '*');
            }
          }
          var block = new Function("return " + body)();
          return await block(params);
        };

        function postError(message, url, line) {
          window.parent.postMessage({ secret: ${secret}, error: message }, '*');
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

        if (!event.data.html) iframe.remove();

        if (event.data.error) {
          reject(event.data.error);
          return;
        }

        if (event.data.invalidate) {
          hal9api.setState({ result: event.data.result });
          hal9api.invalidate();
        }
        else {
          const state = hal9api.getState();
          if (state && state.result)
            accept(state.result)
          else
            accept(event.data.result);
        }
      };

      var responseListener = window.addEventListener('message', onResult);
    });

    var observer = new MutationObserver(function (e) {
      if (e.filter(e => e.removedNodes && e.removedNodes[0] == html).length > 0) {
        window.removeEventListener('message', onResult);
      }
    });
    observer.observe(html.parentNode, { childList: true });

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
