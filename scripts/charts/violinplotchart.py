##
## deps: [ 'numpy', 'pandas', 'micropip' ]
## output: ['plot']
## description: Visualize the distribution of quantitative data across several levels of one (or more) categorical variables such that those distributions can be compared.
## params:
##  - name: x
##    single: true
##    description: The column which should be on the x-axis of the plot. Either x or y should be categorical
##    label: x
##  - name: y
##    description: The column which should be on the y-axis of the plot. Either x or y should be categorical
##    single: true
##    label: y
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
  sns.violinplot(x = data[x], y = data[y])
  plt.show()