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

  cache: true
**/

data = data.sample(aq.frac(samplesize/100), {replace: withReplacement})
