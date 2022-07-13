/**
  params:
    - name: bin
      label: Bin
    - name: maxbins
      label: Max Bins
      value:
        - control: number
          value: 10
  deps:
    - https://cdn.jsdelivr.net/npm/arquero@latest
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js
**/

data = await hal9.utils.toArquero(data);

data.params({ bin, maxbins })

data = data.derive({
  '__bin': aq.bin(bin, { maxbins: maxbins })
})

data = data.rename({ '__bin' : 'bin(' + bin + ')' });
