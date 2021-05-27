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

if (field == undefined) field = []
if (!Array.isArray(field)) field = [ field ];
 
data.sort(function(a,b) {
  var result = 0
  for (let i = 0; i < field.length; i++) {
    var left = a[field[i]];
    var right = b[field[i]];
    result = order == 'asc' ? left - right : right - left;
    if (result != 0) break
  }
  return result;
})