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
  aq.addFunction('fieldExp', field => expression)
  data = data.params({field: field}).filter(data => fieldExp(data[field])
}
