import { api } from '../api/api';
import { designer } from '../designer/designer';
import { node } from '../backend/browser';

const lib = Object.assign(api, {
  designer: designer,
  node: node
});

export default lib;
