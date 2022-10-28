import hal9 as h9
import pandas as pd

df = pd.read_csv('https://gist.githubusercontent.com/curran/a08a1080b88344b0c8a7/raw/0e7a9b0a5d22642a06d3d5b9bcbad9890c8ee534/iris.csv')

h9.set('df', df)

h9.dropdown(uid='species_dropdown', values=lambda: h9.get('df')[
        'species'].unique().tolist(), on_update=lambda value: h9.set('value', value))


def filter_and_show_df(value):
    df = h9.get('df')
    return df[df['species'] == value].to_html()
    
h9.html('iris_table', rawhtml=lambda: filter_and_show_df(h9.get('value')))
