import Executor from './definition';
import * as snippets from '../snippets';
import * as localparams from './localparams';
import * as interpreter from '../interpreters/interpreter';

import clone from '../utils/clone';
import * as datasets from '../datasets';

export default class IFrameExecutor extends Executor {
  async runStep() {
    const script = `
      html.innerHTML = \'\';\n
      var iframe = document.createElement("iframe");
      iframe.style.border = 'none';
      iframe.style.width = '100%';
      iframe.style.height = '100%';

      var content = '<body>Foo</body>';
      iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(content);

      html.appendChild(iframe);
    `;
    
    const context = this.context['html'] ? { html: this.context['html'](this.step) } : {};
    const params = localparams.paramsForFunction(this.params, this.inputs, this.deps, context);

    // retrieve cached hal9 datasets
    for (var paramName in params) {
      const param = params[paramName];
      if (typeof(param) == 'string' && param.startsWith('hal9:text/dataurl')) {
        params[paramName] = datasets.get(param);
      }
    }

    const interpreted = interpreter.interpret(this.script, this.language);
    var result = await snippets.runFunction(interpreted, params);

    if (this.callbacks && this.callbacks.onInvalidate) {
      this.callbacks.onInvalidate(Object.assign({}, this.params, this.inputs));
    }

    return result;
  }
}
