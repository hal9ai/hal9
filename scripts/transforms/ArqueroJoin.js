/**
  input:
    - data
    - right
  params:
    - field
  deps:
    - https://cdn.jsdelivr.net/npm/arquero@latest
  cache: true
**/

data = data.join(right, field)
