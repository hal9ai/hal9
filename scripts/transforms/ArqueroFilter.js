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
  aq.addFunction('fieldExp', field => filterexp(field), { override: true })
  data = data.params({column: field}).filter(data => $.fieldExp(data[$.column]))
}

