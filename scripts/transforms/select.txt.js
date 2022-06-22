/**
  params:
    - name: columns
      label: Columns
      description: The list of columns to keep
  description: create a new dataframe with a subset of the columns of the original
  deps:
    - https://cdn.jsdelivr.net/npm/arquero@latest
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js
**/
data = await hal9.utils.toArquero(data);
if (columns){
 data = data.select(columns);
 }
