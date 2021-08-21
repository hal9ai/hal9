/**
  params:
    - name: field
      label: Field
    - name: order
      label: Order
      value:
        - control: select
          value: asc
          values:
            - name: asc
              label: Ascending
            - name: desc
              label: Descending
  deps:
    - https://cdn.jsdelivr.net/npm/arquero@latest
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js
**/
data = await hal9.utils.toArquero(data);

if (field) {
  if (!Array.isArray(field)) field = [ field ]
  if (order == 'asc') {
    data = data.orderby(field);
  } else {
    data = data.orderby(field.map(e => aq.desc(e)));
  }
}