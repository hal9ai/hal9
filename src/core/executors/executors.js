import RemoteExecutor from './remote'
import LocalExecutor from './local'
import CachedExecutor from './cached'
import IFrameExecutor from './iframe'

import { isElectron } from '../utils/environment'

export const executorFromMetadata = (metadata, inputs, step, context, script, params, deps, state, language, callbacks, pipelinename) => {
  if (metadata.environment === 'desktop') {
    metadata.environment = isElectron() ? undefined : 'worker';
  }

  if (metadata.cache) {
    return new CachedExecutor(metadata, inputs, step, context, script, params, deps, state, language, callbacks, pipelinename);
  }
  else if (metadata.environment === 'worker') {
    return new RemoteExecutor(metadata, inputs, step, context, script, params, deps, state, language, callbacks, pipelinename);
  }
  else if (metadata.environment === 'iframe') {
    return new IFrameExecutor(metadata, inputs, step, context, script, params, deps, state, language, callbacks, pipelinename);
  }
  else {
    return new LocalExecutor(metadata, inputs, step, context, script, params, deps, state, language, callbacks, pipelinename);
  }
}
