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
    let newApi;
    if (options.iframe) {
      newApi = await iframe.init(options, hal9wnd);
    } else {
      newApi = native.init(options, hal9wnd);
    }

    if (newApi) {
      Object.assign(newApi, {
        design: async (pid) => {
          await launchDesigner(newApi, options, pid);
        }
      });
    }

    return newApi;
  }
}
