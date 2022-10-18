import defaultClone from './clone';
import { loadScripts } from './scriptloader';

var deps = {};

const defaultOp = (e) => e;

const arqueroTest = (e) => e && typeof(e.toJs) !== 'function' && typeof(e._data) === 'object';

const arqueroColumns = (e) => e.columnNames();

const arqueroClone = (e) => e;

const arqueroSerialize = (e) => e;

const arqueroRoot = async () => {
  var aq = aq;

  if (deps.aq) {
    aq = deps.aq;
  }
  else {
    if (typeof(window) == 'undefined' && !aq) {
      throw 'Arquero is not available';
    }
    aq = window.aq ? window.aq : null;
  }

  if (!aq) {
    await loadScripts([ 'https://cdn.jsdelivr.net/npm/arquero@latest' ]);
    aq = window.aq;
  }

  return aq;
}

const arqueroToRows = async (x) => {
  var rows = [];
  x.scan(function(i, data) {
    const row = Object.fromEntries(Object.keys(data).map(e => [e, data[e].get(i)]));
    rows.push(row);
  }, true);

  return rows;
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

const arqueroTop = (df, limit) => {
  return df.slice(0, limit);
}


const danfoTest = (e) => e && typeof(e.col_data_tensor) === 'object';

const danfoColumns = (e) => e.columns;

const danfoClone = (e) => e;

const danfoToRows = async (x) => {
  return JSON.parse(await x.to_json())
}

const danfoSerialize = (e) => e;

const danfoDeserialize = (e) => e;

const danfoIsSerialized = (e) => false;

const danfoEnsure = (e) => e;

const danfoTop = (e, limit) => e;


const arrayTest = (e) => Array.isArray(e) && (e.length == 0 || typeof(e[0]) == 'object');

const arrayColumns = (e) => e.length == 0 ? [] : Object.keys(e[0]);

const arrayClone = defaultClone;

const arrayToRows = (e) => e;

const arraySerialize = (e) => e;

const arrayDeserialize = (e) => e;

const arrayIsSerialized = (e) => false;

const arrayEnsure = (e) => e;

const arrayTop = (e, limit) => e.slice(0, limit);


const pyodideTest = (e) => e && e.type === 'DataFrame';

const pyodideColumns = (e) => e.columns.values.tolist().toJs();

const pyodideClone = (e) => JSON.parse(e.to_json(undefined, 'records'));

const pyodideToRows = (x) => {
  return JSON.parse(x.to_json(undefined, 'records'))
};

const pyodideSerialize = (e) => e;

const pyodideDeserialize = (e) => e;

const pyodideIsSerialized = (e) => false;

const pyodideEnsure = (e) => e;

const pyodideTop = (e, limit) => e;


const remoteTest = (e) => typeof(e) == 'object' && e !== null && e.type == 'remotedf'

const remoteCast = (fn) => {
  return (e) => fn(e.subset);
}


const generalized = [
  {
    test: arqueroTest,
    columns: arqueroColumns,
    clone: arqueroClone,
    serialize: arqueroSerialize,
    deserialize: arqueroDeserialize,
    serialized: arqueroIsSerialized,
    ensure: arqueroEnsure,
    top: arqueroTop,
    toRows: arqueroToRows,
  },
  {
    test: danfoTest,
    columns: danfoColumns,
    clone: danfoClone,
    serialize: danfoSerialize,
    deserialize: danfoDeserialize,
    serialized: danfoIsSerialized,
    ensure: danfoEnsure,
    top: danfoTop,
    toRows: danfoToRows,
  },
  {
    test: arrayTest,
    columns: arrayColumns,
    clone: arrayClone,
    serialize: arraySerialize,
    deserialize: arrayDeserialize,
    serialized: arrayIsSerialized,
    ensure: arrayEnsure,
    top: arrayTop,
    toRows: arrayToRows,
  },
  {
    test: pyodideTest,
    columns: pyodideColumns,
    clone: pyodideClone,
    serialize: pyodideSerialize,
    deserialize: pyodideDeserialize,
    serialized: pyodideIsSerialized,
    ensure: pyodideEnsure,
    top: pyodideTop,
    toRows: pyodideToRows,
  },
  {
    test: remoteTest,
    columns: remoteCast(arrayColumns),
    clone: defaultClone,
    serialize: defaultOp,
    deserialize: defaultOp,
    serialized: defaultOp,
    ensure: defaultOp,
    top: remoteCast(arrayTop),
    toRows: remoteCast(e => e),
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

export const deserialize = (df) => {
  const type = generalized.find(maybe => maybe.serialized(df));
  return type ? type.deserialize(df) : df;
}

export const isSerialized = (df) => {
  const type = generalized.find(maybe => maybe.serialized(df));
  return type ? true : false;
}

export const ensure = async (df) => {
  const type = generalized.find(maybe => maybe.test(df));
  return type ? await type.ensure(df) : [];
}

export const top = (df, limit) => {
  const type = generalized.find(maybe => maybe.test(df));
  return type ? type.top(df, limit) : df;
}

export const toRows = (df) => {
  const type = generalized.find(maybe => maybe.test(df));
  return type ? type.toRows(df) : df;
}

export const setDeps = (newdeps) => {
  deps = newdeps;
}
