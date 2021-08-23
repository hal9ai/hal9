/**
  params:
    - name: samplesize
      label: Sample Size
      value:
        - control: range
          value: 50
          min: 1
          max: 100
    - name: withReplacement
      label: With Replacement
      value:
        - control: select
          value: True
          values:
            - name: True
              label: True
            - name: False
              label: False        
  deps:
    - https://cdn.jsdelivr.net/npm/arquero@latest
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js

  cache: true
**/

data = await hal9.utils.toArquero(data);
data = data.sample(aq.frac(samplesize/100), {replace: withReplacement})
