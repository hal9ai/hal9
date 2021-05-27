/**
  params:
    - name: samplesize
      label: Sample Size
      value:
        - control: range
          value: 50
          min: 1
          max: 100
  cache: true
**/

sampled = [];
for (var idx = 0; idx < data.length; idx++) {
  if (Math.random() <= samplesize / 100.0) sampled.push(data[idx]);
}
data = sampled;
