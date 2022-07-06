##
## deps: [ 'numpy', 'pandas', 'micropip' ]
## output: ['plot']
## description: Use box and whiskers diagrams to show the distribution with respect to categories 
## params:
##  - name: x
##    description: Column from the dataframe used to position the marks along the x axis 
##    single: true
##    label: x
##  - name: y
##    label: y
##    description: Column from the dataframe used to position the marks along the y axis
##    single: true
##

import numpy as np
import pandas as pd
import micropip
await micropip.install('seaborn')
import seaborn as sns
import matplotlib.pyplot as plt

if 'data' in dict(globals()):
  data = pd.DataFrame(data)
else:
  data = pd.DataFrame({'Name':[ 'Tom', 'Nick' ], 'Age':[ 56, 33 ]})
if (x and y):
  sns.boxplot(x = data[x], y = data[y])
  plt.show()