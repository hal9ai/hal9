import hal9 as h9
import statsmodels.api as sm
import pandas as pd

iris = sm.datasets.get_rdataset("iris", "datasets", cache=True).data
df = pd.DataFrame(iris)

h9.set('df', df)

h9.node(uid = 'dropdown', values = lambda :h9.get('df')['Species'].unique().tolist(), on_update=lambda x: h9.set('value', x))

def filter_and_show_df(value):
    df = h9.get('df')
    return df[df['Species'] == value].to_html()

h9.node('rawhtml', rawhtml = lambda :filter_and_show_df(h9.get('value')))
