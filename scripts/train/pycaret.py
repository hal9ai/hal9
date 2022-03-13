##
## input: [ data ]
## output: [ stdout, plot, model ]
## environment: worker
## cache: true
## params:
##  - name: x
##    label: x
##  - name: y
##    label: y
##    single: true
from pycaret.classification import *

data = pd.DataFrame(data)
x.append(y)
df = data[x]


clf = setup(data=df, target=y, silent = True)

best_model = compare_models(fold=3)
print(best_model)

# Tune with grid search
tuned = tune_model(best_model)
plot = plot_model(tuned, plot="confusion_matrix")

# Predict on holdout set
predict_model(tuned)

model = finalize_model(tuned)
