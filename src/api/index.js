import * as native from './native';
import * as iframe from './iframe';
import clone from '../core/utils/clone';
import { launchDesigner } from './designer';

var api = Object.assign(native.init(), {
  init: init,
});

export default api;

export async function init(options, hal9wnd) {
  hal9wnd = hal9wnd ? hal9wnd : window.hal9;

  if (options.inplace) {
    for (const key in api) {
      delete api[key];
    }
    if (options.iframe) {
      Object.assign(api, await iframe.init(options, hal9wnd));
    } else {
      Object.assign(api, native.init(options, hal9wnd));
    }
  }
  else {
    if (options.iframe) {
      api = await iframe.init(options, hal9wnd);
    }
    else {
      api = await native.init(options, hal9wnd);
    }

    if (api) {
      api = Object.assign(api, {
        design: async (pid) => {
          await launchDesigner(api, options, pid)
        }
      })
    }
  }

  return api;
}
