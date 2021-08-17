/**
  params:
    - name: field
      label: Field
  deps:
    - https://cdn.jsdelivr.net/npm/arquero@latest
**/
if (field) {
  data = data.column(field)
}
