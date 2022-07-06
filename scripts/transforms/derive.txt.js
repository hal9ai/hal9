/**
  description: Derive a new column on the basis of an expression, or replace an exisitingone
  input: [data]
  output: [data]
  params:
    - name: column
      label: Column
      description: The name of the new column. If this is a column that already exists in the dataframe, the derived column replaces the exisiting one.
      value:
        - control: 'textbox'
          value: 'mycolumn'
    - name: expression
      label: 'Expression'
      description: The expression based on which the new columns are derived
      value:
        - control: 'textbox'
          value: data[columns[0]]
  deps:
    - https://cdn.jsdelivr.net/npm/arquero@latest
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js 
**/

data = await hal9.utils.toArquero(data);
if (expression && column) {
  var mapExp = new Function('data', 'columns', 'return '+ expression);
  data = data.derive({ column: aq.escape(e => mapExp(e, data.columnNames())) });
  data = data.rename({ column : column });
}