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
**/

if (field) {
    if (order == 'asc') {
        data = data.orderby(field);
    } else {
        data = data.orderby(aq.desc(field));
    }
}
