##
## input: [ 'model', 'data' ]
## params:
##  - name: x
##    label: x
## environment: worker
## cache: true
##

import numpy as np
import pandas as pd

data = pd.DataFrame(data)

if x:
  if isinstance(x, str):
      x = [x]
  x_s = data[x]
  preds = model.predict(x_s)
  data['predictions'] = preds
