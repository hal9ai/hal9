/**
  description: create a dataframe which is a summary of the input. Commonly used for computing averages or sums across the dataframe.
  params:
    - name: group
      label: Group
      description: The list of columns by which to group
      single: false
      static: false
    - name: field
      label: Columns
      description: The list of columns who's values to collect
      single: false
      static: false
    - name: summarizer
      label: Summarizer
      description: The summarizer method to aggregate the values collected, default- count
      value:
        - control: select
          value: count
          values:
            - name: deviation
              label: Standard Deviation
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
    - https://cdn.jsdelivr.net/npm/arquero@latest
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js
**/
data = await hal9.utils.toArquero(data);
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
  for (var i = 0; i < field.length; i++) {
    rollUpDict[summarizer+'('+field[i]+')'] = summarizerMap[summarizer](field[i])
  }
  data = data.groupby(group).rollup(rollUpDict)
}
