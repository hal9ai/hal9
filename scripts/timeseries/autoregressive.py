##
## params:
##   - name: datefield
##     label: Date
##   - name: predictfield
##     label: Predict
## environment: worker
## cache: true
##

import numpy as np
import pandas as pd
from statsmodels.tsa.statespace.sarimax import SARIMAX

data = pd.DataFrame(data)

data[datefield] = pd.to_datetime(data[datefield])

data['date__hal9'] = data[datefield]

data = data.set_index(datefield)

model = SARIMAX(data[predictfield], order=(3, 1, 1)).fit()

data['predictions'] = model.predict()

data = data.rename({ 'date__hal9': datefield }, axis = 1)
