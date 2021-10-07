import Executor from './definition';
import * as workers from '../workers';

export default class RemoteExecutor extends Executor {
  async runStep() {
    const html = this.context['html'] ? this.context['html'](this.step) : null;
    const size = html ? { width: html.offsetWidth, height: html.offsetHeight } : { width: 640, height: 480 };

    var workerUrl = await workers.getValidWorkerUrl(this.pipelinename);

    var res = await fetch(workerUrl + '/execute', {
      method: 'POST',
      body: JSON.stringify({ operation: 'runstep', params: [ this.metadata, this.inputs, this.step, Object.assign(size, this.context), this.script, this.params, this.language, this.pipelinename ] }),
      headers: { 'Content-Type': 'application/json' }
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
    return await res.json();
  }
}
