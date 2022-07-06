/**
  description: Fold one or more of the dataframe's columns into Key-Value Pairs. The resulting dataframe will have two columns, one with the column names and the other with the column values
  input: [data]
  output: [data]
  params:
    - name: gather
      label: Gather
      static: false
      single: false
      description: the list of columns to convert into key-value pairs
  deps:
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js
    - https://cdn.jsdelivr.net/npm/arquero@latest
**/
data = await hal9.utils.toArquero(data);


data = data.fold(gather)
