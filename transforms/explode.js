/**
  params:
    - name: column
      label: 'Column'
**/

if (column) {
  if (!Array.isArray(data[0][column])) {
    data = data.map(e => {
      e[column] = Array.from(e[column].toString());
      return e;
    })
  }
  
  var exploded = [];

  data = data.forEach((row, index) => {
    exploded.push(...row[column].map(e => {
      var result = Object.assign(row);
      result[column] = e
      return result;
    }));
  });

  data = exploded;
}
