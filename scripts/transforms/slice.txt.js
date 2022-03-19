/**
  input: [ data ]
  params:
    - name: start
      label: 'Start'
      value:
        - control: 'number'
          value: ''
          lazy: true
    - name: end
      label: 'End'
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

