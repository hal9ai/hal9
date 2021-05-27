/**
  params:
    - name: expression
      label: 'Expression'
      value:
        - control: 'textbox'
          value: row.label = 'Row ' + index
**/

if (expression) {
  var mapexpr = new Function('row', 'index', expression + '; return row;');
  data = data.map((row, index) => {
    return mapexpr(row, index);
  });
}
