/**
  description: Filter a dataframe to a subset of rows on the basis of particular expression applied to a particular column
  input: [data]
  output: [data]
  params:
    - name: field
      label: Field
      description: The column on which to filter
      single: true
      static: false
    - name: expression
      label: 'Expression'
      control: the criteria on which to filter the rows
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
