##
## deps: [ 'numpy', 'pandas' ]
## params:
##   - name: age
##     label: Age
##     value:
##       - control: range
##         value: '10'
##

import numpy as np
import pandas as pd

data = pd.DataFrame({'Name':[ 'Tom', 'Sarah' ], 'Age':[ 56, int(age) ]})
