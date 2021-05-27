/**
  input: [ data ]
  params:
    - name: start
      label: 'Start'
      value:
        - control: 'number'
          value: 0
          lazy: true
    - name: end
      label: 'End'
      value:
        - control: 'number'
          value: 3
          lazy: true
**/

data = data.slice(start, end);
