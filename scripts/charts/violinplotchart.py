##
## deps: [ 'numpy', 'pandas', 'micropip' ]
## output: ['plot']
## params:
##  - name: x
##    label: x
##  - name: y
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