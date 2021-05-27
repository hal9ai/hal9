/**
  output: [ html ]
  params:
    - data
    - image
    - name: columns
      label: 'Columns'
      value:
        - control: 'number'
          value: 5
          lazy: true
**/

var cols = [];

for (let colIdx = 0; colIdx < columns; colIdx++) {
  var col = document.createElement('div');
  col.style.flexDirection = 'column';
  col.style.width = 100 / columns + '%';
  cols.push(col);
  html.appendChild(cols[cols.length - 1]);
}

for (idx in data) {
  var img = document.createElement('img');
  img.src = data[idx][image];
  img.style.display = 'flex';
  img.style.width = '100%';
  cols[idx % columns].appendChild(img);
}

html.style.display = 'flex';
html.style.overflow = 'hidden';
