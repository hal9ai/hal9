import RemoteExecutor from './remote'
import LocalExecutor from './local'
import CachedExecutor from './cached'
import IFrameExecutor from './iframe'

import { isElectron } from '../utils/environment'

export const executorFromMetadata = (metadata, inputs, step, context, script, params, deps, state, language, callbacks) => {
  if (metadata.environment === 'desktop') {
    metadata.environment = isElectron() ? undefined : 'worker';
  }

  if (metadata.cache) {
    return new CachedExecutor(inputs, step, context, script, params, deps, state, language, callbacks);
  }
  else if (metadata.environment === 'worker') {
    return new RemoteExecutor(inputs, step, context, script, params, deps, state, language, callbacks);
  }
  else if (metadata.environment === 'iframe') {
    return new IFrameExecutor(inputs, step, context, script, params, deps, state, language, callbacks);
  }
  else {
    return new LocalExecutor(inputs, step, context, script, params, deps, state, language, callbacks);
  }
}
