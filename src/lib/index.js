import { api } from '../api/api';
import { backend } from '../backend/backend';
import { designer } from '../designer/designer';
import * as browser from '../runtimes/browser';

const lib = Object.assign(api, {
  designer: designer,
  backend: backend,
  browser: browser,
});

export default lib;
