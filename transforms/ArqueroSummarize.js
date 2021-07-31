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
  deviation: aq.op.stdev,
  first: aq.op.first_value,
  last: aq.op.last_value,
  max: aq.op.max,
  mean: aq.op.mean,
  median: aq.op.median,
  min: aq.op.min,
  count: aq.op.count,
  sum: aq.op.sum,
  variance: aq.op.variance
};

var rollUpDict = {};
if (field.length == 0 )
  data = data.groupby(group).count()
else {
  for (var i = 0; i <= field.length; i++) {
    rollUpDict[summarizer+'('+field[i]+')'] = summarizerMap(field[i]) 
  }
  data = data.groupby(group).rollup(rollUpDict)
}
