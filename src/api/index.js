import * as native from './native';
import * as iframe from './iframe';
import { launchDesigner } from './designer';

const api = Object.assign(native.init(), {
  init: init,
});

export default api;

export async function init(options, hal9wnd) {
  hal9wnd = hal9wnd ? hal9wnd : window.hal9;

  for (const key in api) {
    delete api[key];
  }
  if (options.iframe) {
    Object.assign(api, await iframe.init(options, hal9wnd));
  } else {
    Object.assign(api, native.init(options, hal9wnd));
  }

  Object.assign(api, {
    design: async (pid) => {
      await launchDesigner(api, options, pid)
    }
  });
}
