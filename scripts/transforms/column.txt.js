/**
  params:
    - name: field
      label: Field
  
**/
if (field) {
  data = data.map(function(row, index){return row[field];})
}
