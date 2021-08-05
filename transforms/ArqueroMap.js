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
  data = data.derive(column : data => expression;
}
