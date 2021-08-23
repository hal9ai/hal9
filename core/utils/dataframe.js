import defaultClone from './clone';

import * as aq from 'arquero';

const arqueroTest = (e) => e && typeof(e.columnNames) === 'function';

const arqueroColumns = (e) => e.columnNames();

const arqueroClone = (e) => e;

const arqueroSerialize = (e) => e;

const arqueroDeserialize = (e) => aq.table(JSON.parse(e).data);

const arqueroIsSerialized = (e) => /{\"schema\":/g.test(e)


const danfoTest = (e) => e && typeof(e.col_data_tensor) === 'object';

const danfoColumns = (e) => e.columns;

const danfoClone = (e) => e;

const danfoSerialize = (e) => e;

const danfoDeserialize = (e) => e;

const danfoIsSerialized = (e) => false


const arrayTest = (e) => Array.isArray(e) && (e.length == 0 || typeof(e[0]) == 'object');

const arrayColumns = (e) => e.length == 0 ? [] : Object.keys(e[0]);

const arrayClone = defaultClone;

const arraySerialize = (e) => e;

const arrayDeserialize = (e) => e;

const arrayIsSerialized = (e) => false


const generalized = [
  {
    test: arqueroTest,
    columns: arqueroColumns,
    clone: arqueroClone,
    serialize: arqueroSerialize,
    deserialiaze: arqueroDeserialize,
    serialized: arqueroIsSerialized,
  },
  {
    test: danfoTest,
    columns: danfoColumns,
    clone: danfoClone,
    serialize: danfoSerialize,
    deserialiaze: danfoDeserialize,
    serialized: danfoIsSerialized,
  },
  {
    test: arrayTest,
    columns: arrayColumns,
    clone: arrayClone,
    serialize: arraySerialize,
    deserialiaze: arrayDeserialize,
    serialized: arrayIsSerialized,
  },
];

export const isDataFrame = (df) => {
  const type = generalized.find(maybe => maybe.test(df));
  return type ? true : false;
}

export const columns = (df) => {
  const type = generalized.find(maybe => maybe.test(df));
  return type ? type.columns(df) : [];
}

export const clone = (df) => {
  const type = generalized.find(maybe => maybe.test(df));
  return type ? type.clone(df) : [];
}

export const serialize = (df) => {
  const type = generalized.find(maybe => maybe.test(df));
  return type ? type.serialize(df) : df;
}

export const deserialiaze = (df) => {
  const type = generalized.find(maybe => maybe.serialized(df));
  return type ? type.deserialiaze(df) : df;
}

export const isSerialized = (df) => {
  const type = generalized.find(maybe => maybe.serialized(df));
  return type ? true : false;
}

