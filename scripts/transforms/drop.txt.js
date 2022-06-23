/**
  description: Remove selected columns from the dataframe
  params:
    - name: columns
      label: Columns
      static: false
      single: false
      description: The list of columns to remove
  deps:
    - https://cdn.jsdelivr.net/npm/arquero@latest
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js
**/
data = await hal9.utils.toArquero(data);
if (columns){
 data = data.select(aq.not(columns));
 }
