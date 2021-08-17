/**
  params:
    - name: column
      label: Column
      value:
        - control: 'textbox'
    - name: expression
      label: 'Expression'
      value:
        - control: 'textbox'
          value: row.id = index
**/

if (expression && column) {
    var mapExp = new Function('data', 'return '+ expression);
    data = data.derive({column: aq.escape(data => mapExp(data))});
    data = data.rename({column : column});
}
