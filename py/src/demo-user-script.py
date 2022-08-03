import bussin as bs
import pandas as pd

df = pd.DataFrame({'state': ("CA", "WA", "OR"),
    'statistic': (69, 420, 666)})
bs.set(df)

bs.dropdown('Dropdown', values = lambda :bs.get(df).columns, on_update=lambda x: bs.set('value', x))

def filter_and_show_df(value):
    df = bs.get('df')
    return df[df['state'] == value].to_html()

bs.code('dataframe generator', filter_and_show_df)