##
## params:
##   - name: datefield
##     label: Date
##   - name: predictfield
##     label: Predict
## deps: [ 'numpy', 'pandas', 'statsmodels' ]
##

import numpy as np
import pandas as pd
from statsmodels.tsa.statespace.sarimax import SARIMAX

data = pd.DataFrame(data)

data['Month'] = pd.to_datetime(data[datefield], unit ='s')

data['date2'] = data['Month']

data = data.set_index("Month")

# data = SARIMAX(data[predictfield], order=(3, 1, 1)).fit()

data = 123
