/**
  params:
    - window
    - name: size
      label: Size
      value:
        - control: range
          value: 20
          min: 1
          max: 100
**/

if (!Array.isArray(window)) window = window ? [ window ] : [];

var columns = window.map(column => data.map(e => e[column]));

data = data.map((row, i) => {
  for (var idx = 0; idx < columns.length; idx++) {
    var column = columns[idx];
    row['window' + window[idx]] = (new Array(...column)).splice(i - size, size);
  }
  return row;
});

data = data.splice(size);
