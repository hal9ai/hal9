/**
  params:
    - name: column
      label: Column
  deps:
    - https://cdn.jsdelivr.net/npm/arquero@latest
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js 
**/

data = await hal9.utils.toArquero(data);
if (column) {
  data = data.params({column}).derive({ ra: aq.rolling((d, $) => aq.op.sum(d[$.column])) });
  data = data.rename({ ra : 'rollingSum_' + column });
}