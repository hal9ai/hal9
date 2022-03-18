import Executor from './definition';
import * as workers from '../workers';

import * as dataframe from '../utils/dataframe';

const toRowsFromArquero = function(x) {
  var rows = [];
  x.scan(function(i, data) {
    const row = Object.fromEntries(Object.keys(data).map(e => [e, data[e].get(i)]));
    rows.push(row);
  }, true);

  return rows;
}

export default class RemoteExecutor extends Executor {
  async runStep() {
    const html = this.context['html'] ? this.context['html'](this.step) : null;
    const size = html ? { width: html.offsetWidth, height: html.offsetHeight } : { width: 640, height: 480 };

    var workerUrl = await workers.getValidWorkerUrl(this.pipelinename, this.context.headers);

    // remove arquero objects which don't serialize nicely
    Object.keys(this.inputs).forEach(input => {
      if (this.inputs[input] && typeof(this.inputs[input].columns) == 'function') {
        this.inputs[input] = toRowsFromArquero(this.inputs[input]);
      }
    })

    var res = await fetch(workerUrl + '/execute', {
      method: 'POST',
      body: JSON.stringify({ operation: 'runstep', params: [ this.metadata, this.inputs, this.step, Object.assign(size, this.context), this.script, this.params, this.language, this.pipelinename ] }),
      headers: Object.assign(
        { 'Content-Type': 'application/json' },
        this.context.headers
      )
    });

    if (!res.ok) {
      var details = res.statusText;
      try {
        details = await res.json();
      }
      catch (e) {}

      details = typeof(details) === 'string' ? details : JSON.stringify(details);
      throw 'Failed to execute step on remote worker: ' + details;
    }
    
    var result = await res.json();

    // data frames can loose their prototype functions when crossing the iframe boundary
    for (const key of Object.keys(result)) {
      if (dataframe.isDataFrame(result[key])) {
        result[key] = await dataframe.ensure(result[key]);
      }
    }

    return result;
  }
}
