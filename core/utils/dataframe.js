export const columns = (df) => {
  if (!df || !Array.isArray(df) || df.length == 0)
    return [];
  else
    return Object.keys(df[0]);
}
