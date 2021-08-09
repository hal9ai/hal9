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
  aq.addFunction('fieldExp', field => expression, { override: true })
  data = data.params({column: field}).filter(data => $.fieldExp(data[$.column]))
}
