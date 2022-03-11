##
## input: [ data ]
## output: [ stdout, plot, model ]
## environment: worker
## cache: true
##

from pycaret.classification import *

data = pd.DataFrame(data)

clf = setup(data=data, target="default", session_id=123)

best_model = compare_models(fold=3)
print(best_model)

# Tune with grid search
tuned = tune_model(best_model)
plot_model(tuned, plot="confusion_matrix")

# Predict on holdout set
predict_model(tuned)

model = finalize_model(tuned)
