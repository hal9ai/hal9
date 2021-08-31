/**
  params:
    - name: column
      label: Column
      value:
        - control: 'textbox'
          value: newColumn
    - name: array
      label: Array
      value:
        - control: 'textbox'
          value: data.indices()
  deps:
    - https://cdn.jsdelivr.net/npm/arquero@latest
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js 
**/
data = await hal9.utils.toArquero(data);
if (array && column) {
  arr = new Function('data', 'return ' + array)
  data = data.assign({ column: arr(data) });
  data = data.rename({ column : column });
}