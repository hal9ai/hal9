import defaultClone from './clone';
import { loadScripts } from './scriptloader';

const arqueroTest = (e) => e && typeof(e.toJs) !== 'function' && typeof(e._data) === 'object';

const arqueroColumns = (e) => e.columnNames();

const arqueroClone = (e) => e;

const arqueroSerialize = (e) => e;

const arqueroRoot = async () => {
  if (typeof(window) == 'undefined' && !aq) {
    throw 'Arquero is not available';
  }

  var aq = window.aq ? window.aq : null;
  if (!aq) {
    await loadScripts([ 'https://cdn.jsdelivr.net/npm/arquero@latest' ]);
    aq = window.aq;
  }

  return aq;
}

const arqueroDeserialize = async (e) => {
  const aq = await arqueroRoot();
  return aq.table(JSON.parse(e.replace(/undefined/g, 'null')).data);
}

const arqueroIsSerialized = (e) => /{\"schema\":/g.test(e)

const arqueroEnsure = async (data) => {
  const aq = await arqueroRoot();
  var columns = {};
  data = data._data;

  Object.keys(data).forEach(e => columns[e] = data[e].data);

  return aq.table(columns);
}


const danfoTest = (e) => e && typeof(e.col_data_tensor) === 'object';

const danfoColumns = (e) => e.columns;

const danfoClone = (e) => e;

const danfoSerialize = (e) => e;

const danfoDeserialize = (e) => e;

const danfoIsSerialized = (e) => false;

const danfoEnsure = (e) => e;


const arrayTest = (e) => Array.isArray(e) && (e.length == 0 || typeof(e[0]) == 'object');

const arrayColumns = (e) => e.length == 0 ? [] : Object.keys(e[0]);

const arrayClone = defaultClone;

const arraySerialize = (e) => e;

const arrayDeserialize = (e) => e;

const arrayIsSerialized = (e) => false;

const arrayEnsure = (e) => e;


const pyodideTest = (e) => e && e.type === 'DataFrame';

const pyodideColumns = (e) => e.columns.values.tolist().toJs();

const pyodideClone = (e) => JSON.parse(e.to_json(undefined, 'records'));

const pyodideSerialize = (e) => e;

const pyodideDeserialize = (e) => e;

const pyodideIsSerialized = (e) => false;

const pyodideEnsure = (e) => e;


const generalized = [
  {
    test: arqueroTest,
    columns: arqueroColumns,
    clone: arqueroClone,
    serialize: arqueroSerialize,
    deserialiaze: arqueroDeserialize,
    serialized: arqueroIsSerialized,
    ensure: arqueroEnsure,
  },
  {
    test: danfoTest,
    columns: danfoColumns,
    clone: danfoClone,
    serialize: danfoSerialize,
    deserialiaze: danfoDeserialize,
    serialized: danfoIsSerialized,
    ensure: danfoEnsure,
  },
  {
    test: arrayTest,
    columns: arrayColumns,
    clone: arrayClone,
    serialize: arraySerialize,
    deserialiaze: arrayDeserialize,
    serialized: arrayIsSerialized,
    ensure: arrayEnsure,
  },
  {
    test: pyodideTest,
    columns: pyodideColumns,
    clone: pyodideClone,
    serialize: pyodideSerialize,
    deserialiaze: pyodideDeserialize,
    serialized: pyodideIsSerialized,
    ensure: pyodideEnsure,
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

export const ensure = async (df) => {
  const type = generalized.find(maybe => maybe.test(df));
  return type ? await type.ensure(df) : [];
}

