/**
  params:
    - name: left
      label: 'Left'
      value:
        - control: dataset
    - name: right
      label: 'Right'
      value:
        - control: dataset
**/

data = left.map((e, i) => {
  return Object.assign(e, right[i]);
});

