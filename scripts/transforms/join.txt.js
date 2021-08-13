/**
  input:
    - data
    - right
  params:
    - field
  deps:
    - https://www.unpkg.com/@tidyjs/tidy/dist/umd/tidy.min.js
  cache: true
**/

const joinby = {}
joinby[field] = field;

data = Tidy.tidy(data, Tidy.leftJoin(right, { by: joinby }));
