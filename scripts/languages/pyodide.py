##
## deps: [ 'numpy', 'pandas', 'micropip' ]
## 
##

import numpy as np
import pandas as pd

if 'data' in dict(globals()):
  data = pd.DataFrame(data)
else:
  data = pd.DataFrame({'Name':[ 'Tom', 'Nick' ], 'Age':[ 56, 33 ]})