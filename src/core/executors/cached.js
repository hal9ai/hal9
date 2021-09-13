import Executor from './definition'
import * as snippets from '../snippets'

import RemoteExecutor from './remote'
import LocalExecutor from './local'
import IframeExecutor from './iframe'

import * as dataframe from '../utils/dataframe'
import clone from '../utils/clone'

import md5 from 'crypto-js/md5'

import { isElectron } from '../utils/environment'

const smartclone = (entries) => {
  var cloned = {};
  Object.keys(entries).forEach(name => {
    if (dataframe.isDataFrame(entries[name])) {
      cloned[name] = dataframe.clone(entries[name]);
    }
    else {
      cloned[name] = clone(entries[name]);
    }
  });
  return cloned;
}

export default class CachedExecutor extends Executor {
  async runStep() {
    
    // only allow relevant fields to invalidate the cache
    var step = Object.assign({}, { id: this.step.id, params: this.step.params });

    const hashes = {
      inputs: md5(JSON.stringify(this.inputs)).toString(),
      script: md5(JSON.stringify(this.script)).toString(),
      params: md5(JSON.stringify(this.params)).toString()
    };

    var result = null;
    var changed = true;

    if (this.state && this.state.cache && this.state.cache.hashes) {
      const changedHashes = Object.keys(hashes).filter(name => this.state.cache.hashes[name] != hashes[name]);
      if (changedHashes.length > 0) {
        console.log('Cache for step ' + this.step.name + ' invalidated due to ' + JSON.stringify(changedHashes));
      }
      else {
        changed = false;
      }
    }

    if (!changed) {
      result = this.state.cache.result;
    }
    else {
      const metadata = snippets.parseHeader(this.script);

      if (metadata.environment === 'desktop') {
        metadata.environment = isElectron() ? undefined : 'worker';
      }

      var executorClass = null;
      if (metadata.environment === 'worker')
        executorClass = RemoteExecutor;
      else if (metadata.environment === 'iframe')
        executorClass = IframeExecutor;
      else
        executorClass = LocalExecutor;

      var executor = new executorClass(this.inputs, this.step, this.context, this.script, this.params, this.deps, this.state, this.language, this.callbacks);

      result = await executor.runStep();
    }

    result = Object.assign(result, { state: {
      cache: {
        hashes: hashes,
        result: smartclone(result)
      }
    }});

    return result;
  }
}
