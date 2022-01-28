##
## deps: [ 'numpy', 'pandas', 'scipy' ]
## params:
##  - name: x
##    label: Field
##  - name: pval
##    label: Significance Level
##    value:
##      - control: range
##        value: 0.05
##        min: 0
##        max: 1
## output: ['testresult']
import numpy as np
import pandas as pd
import scipy.stats as stats

if 'data' in dict(globals()):
  data = pd.DataFrame(data)
else:
  data = pd.DataFrame({'Name':[ 'Tom', 'Nick' ], 'Age':[ 56, 33 ]})

output ={'Test Result': stats.shapiro(data[x]) [1] < pval, 'P-value': stats.shapiro(data[x]) [1],'Test Statistic': stats.shapiro(data[x]) [0] }
if output['Test Result']:
  output['Test Result'] = 'Failt to reject null hypothesis'
else:
  output['Test Result'] = 'Reject the null hypothesis'
testresult = output