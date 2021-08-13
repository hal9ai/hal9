/**
  params:
    - name: field
      label: Field
    - name: expression
      label: 'Expression'
      value:
        - control: 'textbox'
          value: field != null
**/

if (expression && field) {
  var filterexp = new Function('field', 'return ' + expression);
  data = data.filter(row => filterexp(row[field]));
}
