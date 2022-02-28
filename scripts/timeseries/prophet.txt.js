##
## input: [ data ]
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
from prophet import Prophet

data = pd.DataFrame(data)

data = data.assign(ds = lambda x: x[datefield])
data = data.assign(y = lambda x: x[predictfield])

m = Prophet()
m.fit(data)

future = m.make_future_dataframe(periods=365)

data = m.predict(future)
