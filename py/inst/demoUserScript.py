import hal9 as h9
import pandas as pd

df = pd.DataFrame({'state': ("CA", "WA", "OR"),
    'statistic': (69, 420, 666)})
h9.set('df', df)

h9.dropdown('dropdown', values = lambda :h9.get('df').columns, on_update=lambda x: h9.set('value', x))

def filter_and_show_df(value):
    df = h9.get('df')
    return df[df['state'] == value].to_html()

h9.code('rawhtml', lambda :filter_and_show_df(h9.get('value')))