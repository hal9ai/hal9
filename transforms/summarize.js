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
**/

field = Array.isArray(field) ? field : ( field == undefined ? [] : [ field ]);
group = Array.isArray(group) ? group : ( group == undefined ? [] : [ group ]);

const summarizerMap = {
  deviation: Tidy.deviation,
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

var totals = {};
if (field.length == 0 )
  totals = { count: summarizerMap.count('') };
else {
  for (var idx=0; idx < field.length; idx++) {
    totals[summarizer + '(' + field[idx] + ')'] = summarizerMap[summarizer](field[idx]);
  }
}

if (group.length > 0) {
  data = Tidy.tidy(
    data,
    Tidy.groupBy(group, [
      Tidy.summarize(totals)
    ])
  )
}
else {
  data = Tidy.tidy(
    data,
    Tidy.summarize(totals)
  )
}
