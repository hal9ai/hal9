##
## params:
##   - name: datefield
##     label: Date
##   - name: valuefield
##     label: Value
## deps: [ 'pandas', 'micropip', 'statsmodels', 'matplotlib' ]
## outputs: ['data']
##

import pandas as pd
from statsmodels.tsa.seasonal import seasonal_decompose

data = pd.DataFrame(data)

data[datefield] = pd.to_datetime(data[datefield], unit = 's')
data["date2"] = data[datefield]
data = data.set_index(datefield).asfreq('D')
data = data.fillna(method='bfill').fillna(method='ffill')

decomposition = seasonal_decompose(data[valuefield])
data["observed"] = decomposition.observed
data["trend"] = decomposition.trend
data["seasonal"] = decomposition.seasonal
data["residual"] = decomposition.resid
data = data.rename({ 'date2': datefield }, axis = 1)

