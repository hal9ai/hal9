/**
  params:
    - name: source
      label: Source
    - name: window
      label: Window Size
      value:
        - control: number
          value: 7
  deps:
    - https://cdn.jsdelivr.net/npm/arquero@latest
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js 
**/

data = await hal9.utils.toArquero(data);
window = parseInt(window)

data = data.params({source}).derive({
  columns_hal9: aq.rolling((d, $) => 
    op.average(d[$.source]), [window, 0])
});

data = data.rename({ columns_hal9 : 'sma(' + source + ')' });
