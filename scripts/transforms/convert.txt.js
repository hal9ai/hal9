/**
  params:
    - name: column
      label: Column
    - name: expression
      label: 'Expression'
      value:
        - control: 'textbox'
          value: new Date(columns[0])
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

