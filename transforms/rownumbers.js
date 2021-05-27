/**
  params:
    - name: field
      label: Field
    - name: start
      label: Start
      value:
        - control: 'textbox'
          value: 1
    - name: increment
      label: Increment
      value:
        - control: 'textbox'
          value: 1
    - name: increment
      label: Increment
      value:
        - control: 'textbox'
          value: 1
    - name: replace
      label: Replace
      value:
        - control: select
          value: always
          values:
            - { name: always, label: 'Always' }
            - { name: nulls, label: 'Nulls' }
**/

current = start ? parseInt(start) : null;
increment = increment ? parseInt(increment) : (data[1][field] - data[0][field]);
field = field ? field : 'id';

var last = 0;
for (var idx = 0; idx < data.length; idx++) {
  if (replace === 'always' || data[idx][field] === null) {
    if (current === null) current = last + increment;
    data[idx][field] = current;
    current += increment;
  }

  last = data[idx][field];
}
