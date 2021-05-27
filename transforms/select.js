/**
  params:
    - columns
**/

if (columns) {
  columns = !Array.isArray(columns) ? [ columns ] : columns;
  data = data.map(e => {
    Object.keys(e).forEach(x => {
      if (!columns.includes(x)) delete e[x];
    });
    return e;
  });
}