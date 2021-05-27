/**
  params:
    - name: column
      label: 'Column'
**/

var exploded = [];

data = data.forEach((row, index) => {
  exploded.push(...row[column].map(e => {
    var result = Object.assign(row);
    result[column] = e
    return result;
  }));
});

data = exploded;
