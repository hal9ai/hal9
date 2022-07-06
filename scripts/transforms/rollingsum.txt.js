/**
  input: [data]
  output: [data]  
  params:
    - name: column
      label: Column
      single: false
      static: false
      description: The column for which to calculate the rolling sum.
  description: Calculate the rolling sum on a given column. The rolling sum is added to the dataframe as 'rollingSum' + name of the input column
  deps:
    - https://cdn.jsdelivr.net/npm/arquero@latest
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js
**/

data = await hal9.utils.toArquero(data);
if (column) {
  if (!Array.isArray(column)) column = [column]

  for (var i = 0; i < column.length; i++)
  {
    data = data.params({col: column[i]}).derive({ ra: aq.rolling((d, $) => aq.op.sum(d[$.col])) });
    data = data.rename({ ra : 'rollingSum_'+column[i] });
  }
}
