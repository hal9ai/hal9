##
## deps: [ 'numpy', 'pandas', 'micropip' ]
## params:
##   - name: added
##     label: New Users
##   - name: drop
##     label: Lost Users
## cache: true
##

import numpy as np
import pandas as pd

data = pd.DataFrame(data)

if (added and drop):
  churn = data.assign(
    shifted_drop = lambda x: x[drop].cumsum().shift(1).fillna(0.0),
    shifted_new = lambda x: x[added].shift(1).fillna(0.0),
    churn = lambda x: x[drop] * 100 / (x[added] + x['shifted_new'] - x['shifted_drop'])
  )[['churn']]

  data = data.join(churn["churn"])
