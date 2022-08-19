import Executor from './definition';
import * as snippets from '../snippets';
import * as localparams from './params';
import * as interpreter from '../interpreters/interpreter';

import clone from '../utils/clone';

function getHtmlForLocal(html, step) {
  if (typeof(html) == 'function')
    return html(step);
  else if (typeof(html) == 'string')
    return document.getElementsByClassName(html)[0];
  else
    return html;
}

export default class LocalExecutor extends Executor {
  async runStep() {
    var params = localparams.paramsForFunction(this.params, this.inputs, this.deps);

    // add html to params
    params['html'] = getHtmlForLocal(this.context['html'], this.step);
    if (this.deps && this.deps.hal9) this.deps.hal9.setHtml(params['html']);

    // retrieve cached hal9 datasets
    params = localparams.fetchDatasets(params);

    // add context to params
    params['hal9__context'] = this.context;

    const interpreted = await interpreter.interpret(this.script, this.language, this.metadata, this.context, this.step);
    var result = await snippets.runFunction(interpreted.script, params, interpreted.header);

    if (this.callbacks && this.callbacks.onInvalidate) {
      this.callbacks.onInvalidate(Object.assign({}, this.params, this.inputs));
    }

    if (this.state?.events?.onParams) {
      for (let param of Object.keys(params)) this.state.events.onParams(param, params[param]);
    }

    return result;
  }
}
