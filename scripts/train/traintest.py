##
## params:
##  - name: x
##    label: x
##  - name: y
##    label: y
## output: [ 'data', 'test' ]
## environment: worker
## cache: true
##

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split

data = pd.DataFrame(data)

if x and y:
  if not isinstance(x, str):
    x = x.to_py()
  if not isinstance(y, str):
    y = y.to_py()

  xtrain, xtest , ytrain, ytest = train_test_split(data[x], data[y])
  data = pd.DataFrame()
  data[x] = xtrain
  data[y] = ytrain
  test = pd.DataFrame()
  test[x] = xtest
  test[y] = ytest