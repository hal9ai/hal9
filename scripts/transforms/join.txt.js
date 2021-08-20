/**
  input:
    - data
    - right
  params:
    - field
  deps:
    - https://cdn.jsdelivr.net/npm/arquero@latest
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js
  cache: true
**/

data = await hal9.utils.toArquero(data);
right = await hal9.utils.toArquero(right);

data = data.join(right, field)