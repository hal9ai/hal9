##
## deps: [ 'numpy', 'pandas', 'scipy' ]
## params:
##  - name: x
##    label: Field
##  - name: pval
##    label: Significance Level
##    value:
##      - control: textbox
##        value: 0.05
## output: ['testresult']
## cache: true
##

import numpy as np
import pandas as pd
import scipy.stats as stats

data = pd.DataFrame(data)

output ={'Test Result': stats.shapiro(data[x]) [1] < pval, 'P-value': stats.shapiro(data[x]) [1],'Test Statistic': stats.shapiro(data[x]) [0] }

if output['Test Result']:
  output['Test Result'] = 'Failt to reject null hypothesis'
else:
  output['Test Result'] = 'Reject the null hypothesis'

testresult = output
