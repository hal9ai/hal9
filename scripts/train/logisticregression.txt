##
## input: [data]
## environment: worker
## output: ['stdout', 'data', 'model' ]
## params:
##  - name: x
##    label: x
##  - name: y
##    label: y
##    single: true
## cache: true

import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
import statsmodels.api as sm

data = pd.DataFrame(data)

if x and y:
  if isinstance(x, str):
    x = [x]
  lr = LogisticRegression()
  x_train = data[x]
  x_train = x_train
  y_train = data[y]
  lr.fit(x_train, y_train)
  model = lr
  Xs = sm.add_constant(x_train)
  y = pd.get_dummies(y_train)
  log_reg = sm.MNLogit(y, Xs).fit()
  print(log_reg.summary())
  