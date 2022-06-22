/**
  params:
    - name: samplesize
      label: Sample Percentage
      description: The size of the sample as a percentage of the size of the input dataframe
      value:
        - control: range
          value: 50
          min: 1
          max: 100
    - name: withReplacement
      label: With Replacement
      description: Allow or disallow sampling of the same row more than once. Default- True
      value:
        - control: select
          value: True
          values:
            - name: True
              label: True
            - name: False
              label: False        
  description: creates a dataframe which is random sample of the input
  deps:
    - https://cdn.jsdelivr.net/npm/arquero@latest
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js

  cache: true
**/

data = await hal9.utils.toArquero(data);
data = data.sample(aq.frac(samplesize/100), {replace: withReplacement})
