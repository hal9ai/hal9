/**
  params:
    - name: field
      label: Field
    - name: rename
      label: New Name
      value:
        - control: 'textbox'
          value:
**/

if (field && rename) {
  dict = {};
  dict[field] = rename;
  data = data.rename(dict);
}
