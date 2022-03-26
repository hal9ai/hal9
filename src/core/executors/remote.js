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

const sessionid = (pipelinename, stepid) => {
  const randid = (Math.random()).toString().replace(/[^a-zA-Z0-9]/g, '');
  return pipelinename.replace(/[^a-zA-Z0-9]/g, '_') + '_' + stepid + '_' + randid;
}

export default class RemoteExecutor extends Executor {
  async runStep() {
    const html = this.context['html'] ? this.context['html'](this.step) : null;
    const size = html ? { width: html.offsetWidth, height: html.offsetHeight } : { width: 640, height: 480 };

    this.workerUrl = await workers.getValidWorkerUrl(this.pipelinename, this.context.headers);
    this.sessionid = sessionid(this.pipelinename, this.step.id);

    // remove arquero objects which don't serialize nicely
    Object.keys(this.inputs).forEach(input => {
      if (this.inputs[input] && typeof(this.inputs[input].columns) == 'function') {
        this.inputs[input] = toRowsFromArquero(this.inputs[input]);
      }
    })

    var res = await fetch(this.workerUrl + '/execute', {
      method: 'POST',
      body: JSON.stringify({
        operation: 'runstep',
        params: {
          metadata: this.metadata,
          inputs: this.inputs,
          step: this.step,
          context: Object.assign(size, this.context),
          script: this.script,
          params: this.params,
          language: this.language,
          pipelinename: this.pipelinename,
          sessionid: this.sessionid,
        }
      }),
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

    try {
      await this.updateConsole();
    }
    catch(e) {}
    
    var result = await res.json();

    // data frames can loose their prototype functions when crossing the iframe boundary
    for (const key of Object.keys(result)) {
      if (dataframe.isDataFrame(result[key])) {
        result[key] = await dataframe.ensure(result[key]);
      }
    }

    return result;
  }

  async updateConsole() {
    var res = await fetch(this.workerUrl + '/execute', {
      method: 'POST',
      body: JSON.stringify({
        operation: 'console',
        params: {
          sessionid: this.sessionid,
        }
      }),
      headers: Object.assign(
        { 'Content-Type': 'application/json' },
        this.context.headers
      )
    });

    var entries = await res.json();
    if (entries) {
      for (var entry of entries) {
        console[entry.type](entry.message);
      }
    }
  }
}
