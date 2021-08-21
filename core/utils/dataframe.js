import defaultClone from './clone';

const arqueroTest = (e) => e && typeof(e.columnNames) === 'function';

const arqueroColumns = (e) => e.columnNames();

const arqueroClone = (e) => e;


const danfoTest = (e) => e && typeof(e.col_data_tensor) === 'object';

const danfoColumns = (e) => e.columns;

const danfoClone = (e) => e;


const arrayTest = (e) => Array.isArray(e) && (e.length == 0 || typeof(e[0]) == 'object');

const arrayColumns = (e) => e.length == 0 ? [] : Object.keys(e[0]);

const arrayClone = defaultClone;


const generalized = [
  {
    test: arqueroTest,
    columns: arqueroColumns,
    clone: arqueroClone,
  },
  {
    test: danfoTest,
    columns: danfoColumns,
    clone: danfoClone,
  },
  {
    test: arrayTest,
    columns: arrayColumns,
    clone: arrayClone,
  },
];

export const isDataFrame = (df) => {
  const type = generalized.find(maybe => maybe.test(df));
  return !type.length;
}

export const columns = (df) => {
  const type = generalized.find(maybe => maybe.test(df));
  return type ? type.columns(df) : [];
}

export const clone = (df) => {
  const type = generalized.find(maybe => maybe.test(df));
  return type ? type.clone(df) : [];
}
