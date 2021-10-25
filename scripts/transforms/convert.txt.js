/**
  params:
    - name: field
      label: Field
      single: true
    - name: expression
      label: 'Expression'
      value:
        - control: 'textbox'
          value: new Date(field)
  deps:
    - https://cdn.jsdelivr.net/npm/arquero@latest
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js 
**/

data = await hal9.utils.toArquero(data);
if (expression && field) {
  var mapExp = new Function('field', 'return '+ expression);
  data = data.params({field}).derive({ column: aq.escape((data, $) => mapExp(data[$.field])) });
  data = data.rename({ column : field });
}
