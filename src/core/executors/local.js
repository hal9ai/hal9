import Executor from './definition';
import * as snippets from '../snippets';
import * as localparams from './params';
import * as interpreter from '../interpreters/interpreter';

import clone from '../utils/clone';
import * as datasets from '../datasets';

export default class LocalExecutor extends Executor {
  async runStep() {
    const context = this.context['html'] ? { html: this.context['html'](this.step) } : {};
    var params = localparams.paramsForFunction(this.params, this.inputs, this.deps, context);

    // retrieve cached hal9 datasets
    params = localparams.fetchDatasets(params);

    const interpreted = interpreter.interpret(this.script, this.language);
    var result = await snippets.runFunction(interpreted, params);

    if (this.callbacks && this.callbacks.onInvalidate) {
      this.callbacks.onInvalidate(Object.assign({}, this.params, this.inputs));
    }

    return result;
  }
}
