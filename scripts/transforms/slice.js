/**
  input: [data]
  output: [data]
  description: Create a dataframe with a subset of the rows with indices from start (included) and the end(not included)
  params:
    - name: start
      label: 'Start'
      static: true
      description: The starting index(included)
      value:
        - control: 'number'
          value: ''
          lazy: true
    - name: end
      label: 'End'
      static: true
      description: The ending index(not included)
      value:
        - control: 'number'
          value: ''
          lazy: true
  deps:
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js
**/

data = await hal9.utils.toArquero(data);

if (typeof(start) == 'string' && typeof(end) == 'string') {
  data = data.slice(parseInt(start), parseInt(end));
}

