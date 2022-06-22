/**
  description: replace missing values in a given columns using a given method. null, undefined and NaNs are considered missing values
  params:
    - name: field
      label: Columns
      description: List of columns in which to replace missing values
    - name: method
      label: Method
      description: the function to use to impute the missing values. Currently available options are 'max', 'min', 'mean' median', 'zero'. Default is 'zero'
      value:
        - control: select
          value: zero
          values:
            - name: max
              label: Max
            - name: mean
              label: Mean
            - name: median
              label: Median
            - name: min
              label: Min
            - name: zero
              label: Zero
  deps:
    - https://cdn.jsdelivr.net/npm/arquero@latest
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js
**/
data = await hal9.utils.toArquero(data);
field = Array.isArray(field) ? field : ( field == undefined ? [] : [ field ]);

const methodMap = {
  first: aq.op.first_value,
  last: aq.op.last_value,
  max: aq.op.max,
  mean: aq.op.mean,
  median: aq.op.median,
  min: aq.op.min,
};

var rollUpDict = {};
if (field.length == 0 )
  data = data
else {
  if (method == 'zero') {
    for (var i = 0; i < field.length; i++) {
      rollUpDict[field[i]] = () => 0 
    }
    console.log(rollUpDict)
    data = data.impute(rollUpDict)
  } else {
    data.params({method, methodMap, field})
    for (var i = 0; i < field.length; i++) {
      rollUpDict[field[i]] = methodMap[method](field[i]) 
    }
    data = data.impute(rollUpDict)
  }
}