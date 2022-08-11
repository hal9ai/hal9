import * as native from './native';
import * as iframe from './iframe';
import { launchDesigner } from './designer';

const api = Object.assign(native.init(), {
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

    return api;
  } else {
    let instance;
    if (options.iframe) {
      instance = await iframe.init(options, hal9wnd);
    } else {
      instance = native.init(options, hal9wnd);
    }

    instance = Object.assign(instance, {
      design: async (pid) => {
        await launchDesigner(instance, options, pid);
      }
    })

    return instance;
  }
}
