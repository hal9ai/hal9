/**
  params:
    - name: field
      label: Field
    - name: expression
      label: 'Expression'
      value:
        - control: 'textbox'
          value: field != null
  deps:
    - https://cdn.jsdelivr.net/npm/arquero@latest
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js
**/
data = await hal9.utils.toArquero(data);

if (expression && field) {
  var filterexp = new Function('field', 'return ' + expression);
  data = data.params({field}).filter(aq.escape((data, $)=> filterexp(data[$.field])));
}