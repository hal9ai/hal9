import { api } from '../api/api';
import { designer } from '../designer/designer';
import * as backend from '../backend/browser';

const lib = Object.assign(api, {
  designer: designer,
  backend: backend,
});

export default lib;
