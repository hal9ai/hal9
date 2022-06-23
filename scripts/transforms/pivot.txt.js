/**
  description: Generate a dataframe with a column for each unique value in columns, with rows for each unique value in rows. Each row counts/aggregates the values that match both row and column based on summarizer
  params:
    - name: rows
      label: Rows
      static: false
      description: The column whose unique values should serve as the rows of the new dataframe
      single : true
    - name: columns
      label: Columns
      static: false
      description: The column whose unique values should serve as the columns of the new dataframe
      single: true
    - name: values
      label: Values
      single: false
      static: false
      description: The columns whose values should be collected to serve as the individual cells of the table
    - name: summarizer
      label: Summarizer
      description: the method to aggregate the collected values
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
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js
**/
data = await hal9.utils.toArquero(data);
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
  count: aq.op.valid,
  sum: aq.op.sum,
  variance: aq.op.variance,
  any: aq.op.any
};

var valueDict = {};
if (values.length == 0 ) {
  valueDict = {value: aq.op.count(rows[0])};
} else {
  for (var i = 0; i < values.length; i++) {
    valueDict[summarizer+'('+values[i]+')'] = summarizerMap[summarizer](values[i])
  }
}
data = data.groupby(rows).pivot(columns, valueDict);
