import * as native from './native';
import * as iframe from './iframe';

export const api = Object.assign(native.init(), {
  init: init,
});

export async function init(options, hal9wnd) {
  hal9wnd = hal9wnd ? hal9wnd : window.hal9;

  if (options.inplace) {
    const oldInit = api.init;
    for (const key in api) {
      delete api[key];
    }
    if (options.iframe) {
      Object.assign(api, await iframe.init(options, hal9wnd));
    } else {
      Object.assign(api, native.init(options, hal9wnd));
    }
    api.init = oldInit;

    return api;
  } else {
    let newApi;
    if (options.iframe) {
      newApi = await iframe.init(options, hal9wnd);
    } else {
      newApi = native.init(options, hal9wnd);
    }

    if (newApi) {
      // init shouldn't be called on newApi again
      delete newApi.init;
    }

    return newApi;
  }
}