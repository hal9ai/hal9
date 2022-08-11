import hal9 as h9
import pandas as pd

df = pd.DataFrame({'state': ("CA", "WA", "OR"),
    'statistic': (69, 420, 666)})
h9.set('df', df)

h9.dropdown('Dropdown', values = lambda :bs.get('df').columns, on_update=lambda x: bs.set('value', x))

def filter_and_show_df(value):
    df = bs.get('df')
    return df[df['state'] == value].to_html()

h9.code('rawhtml', lambda :filter_and_show_df(bs.get('value')))