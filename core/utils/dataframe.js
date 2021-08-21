// A generalized dataframe that operates over javascript, arquero and danfo

export const columns = (df) => {
  // isArquero
  if (df && typeof(df.columnNames) === 'function') {
    return result.data.columnNames();
  }
  // isDanfo
  else if (df && typeof(df.col_data_tensor) === 'object') {
    return result.data.columns;
  }
  else if (!df || !Array.isArray(df) || df.length == 0)
    return [];
  else
    return Object.keys(df[0]);
}
