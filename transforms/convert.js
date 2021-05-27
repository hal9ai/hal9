/**
  params:
    - field
    - name: expression
      label: 'Expression'
      value:
        - control: 'textbox'
          value: new Date(field)
**/

if (expression) {
  var mapexpr = new Function('field', 'return ' + expression);
  data = data.map(row => {
    row[field] = mapexpr(row[field])
    return row;
  });
}

