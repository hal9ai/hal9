import { api } from '../api/api';
import { designer } from '../designer/designer';

const lib = Object.assign(api, {
  designer: designer,
});

export default lib;
