/**
  params:
    - name: group
      label: Group
    - name: field
      label: Columns
    - name: summarizer
      label: Summarizer
      value:
        - control: select
          value: count
          values:
            - name: deviation
              label: Deviation
            - name: first
              label: First
            - name: last
              label: Last
            - name: max
              label: Max
            - name: mean
              label: Mean
            - name: median
              label: Median
            - name: min
              label: Min
            - name: count
              label: Count
            - name: sum
              label: Sum
            - name: variance
              label: Variance
  deps:
    - https://d3js.org/d3-array.v2.min.js
    - https://www.unpkg.com/@tidyjs/tidy/dist/umd/tidy.min.js
    - https://cdn.jsdelivr.net/npm/arquero@latest
**/

field = Array.isArray(field) ? field : ( field == undefined ? [] : [ field ]);
group = Array.isArray(group) ? group : ( group == undefined ? [] : [ group ]);

const summarizerMap = {
  deviation: ,
  first: Tidy.first,
  last: Tidy.last,
  max: Tidy.max,
  mean: field => (e => d3.mean(d3.map(e, z => z[field]))),
  median: Tidy.median,
  min: Tidy.min,
  count: x => (e => e.length),
  sum: Tidy.sum,
  variance: Tidy.variance
};
