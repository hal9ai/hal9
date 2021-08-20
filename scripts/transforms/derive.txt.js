/**
  params:
    - name: column
      label: Column
      value:
        - control: 'textbox'
          value: 'mycolumn'
    - name: expression
      label: 'Expression'
      value:
        - control: 'textbox'
          value: data[columns[0]]
  deps: ['https://cdn.jsdelivr.net/npm/arquero@latest'] 
**/

if (expression && column) {
  var mapExp = new Function('data', 'columns', 'return '+ expression);
  data = data.derive({ column: aq.escape(e => mapExp(e, data.columnNames())) });
  data = data.rename({ column : column });
}