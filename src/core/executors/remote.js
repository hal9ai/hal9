import Executor from './definition';
import * as workers from '../workers';

export default class RemoteExecutor extends Executor {
  async runStep() {
    var workerUrl = await workers.getValidWorkerUrl(this.pipelinename);

    var res = await fetch(workerUrl + '/execute', {
      method: 'POST',
      body: JSON.stringify({ operation: 'runstep', params: [ this.metadata, this.inputs, this.step, this.context, this.script, this.params, this.language, this.pipelinename ] }),
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
