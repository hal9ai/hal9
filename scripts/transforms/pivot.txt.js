/**
  params:
    - name: rows
      label: Rows
    - name: columns
      label: Columns
    - name: values
      label: Values
    - name: summarizer
      label: Summarizer
      value:
        - control: select
          value: count
          values:
            - name: any
              label: Any
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
rows = Array.isArray(rows) ? rows : ( rows == undefined ? [] : [ rows ]);
values = Array.isArray(values) ? values : ( values == undefined ? [] : [ values ]);
columns = Array.isArray(columns) ? columns : ( columns == undefined ? [] : [ columns ]);

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
  variance: aq.op.variance,
  any: aq.op.any
};

var valueDict = {};
if (values.length == 0 ) {
  valueDict = {value: aq.op.count(rows[0])};
  console.log(valueDict);
} else {
  for (var i = 0; i < values.length; i++) {
    valueDict[summarizer+'('+values[i]+')'] = summarizerMap[summarizer](values[i]) 
  }
  console.log(valueDict);
}
data = data.groupby(rows).pivot(columns, valueDict);
