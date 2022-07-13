/**
  params:
    - name: field
      label: Field
      single: true
  deps:
    - https://cdn.jsdelivr.net/npm/arquero@latest
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js
**/

data = await hal9.utils.toArquero(data);

var filterexp = function(field) {
  field = field.toString()
  if (field.length <= 2) return false;

  if (/[^a-zA-Z]+/.test(field)) return false;

  if (field[0] != field[0].toUpperCase()) return false;

  if (field.slice(1) != field.slice(1).toLowerCase()) return false;
  
  return true;
}

if (field) {
  data = data.params({field}).filter(aq.escape((data, $)=> filterexp(data[$.field])));
}
