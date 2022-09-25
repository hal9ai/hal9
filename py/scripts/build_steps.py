import json
import yaml
from pathlib import Path
import hal9
import re

gen_code = """import hal9 as h9
from typing import Callable
"""
path = Path(hal9.__file__)
scripts_path = path.parents[2]/'scripts'
with open(scripts_path/'components.json') as f:
    d = json.load(f)
def unpack_param_names(y: dict):
    content = "uid: str"
    if 'params' in y.keys() and 'events' in y.keys():
        params = list(map(lambda x: x['name'], y['params'])) + y['events']
    elif 'events' in y.keys():
        params = y['events']
    else:
        params = list(map(lambda x: x['name'], y['params']))
    for param in params:
        content = content + ", " + param + ": Callable = None"
    return content
def create_kwarg_dict(y: dict):
    kwargs_dict = ''
    if 'params' in y.keys() and 'events' in y.keys():
        params = list(map(lambda x: x['name'], y['params'])) + y['events']
    elif 'events' in y.keys():
        params = y['events']
    else:
        params = list(map(lambda x: x['name'], y['params']))
    for param in params:
        kwargs_dict = kwargs_dict+f'\n\tkwargs["{param}"] = {param}'
    return kwargs_dict
for i, control in enumerate(d['Controls']):
    if control['build'] == False:
        continue
    script = scripts_path / Path(control['source'])
    try:
        with open(script) as s:
            string = s.read()
        if script.suffix == '.html':
            yaml_header= re.findall(r'\<!--\n([\s\S]+)-->', string)[0]
        elif script.suffix == '.js':
            yaml_header= re.findall(r'/\*\*\n([\s\S]+)\*\*/', string)[0]
        header = yaml.safe_load(yaml_header)
        gen_code = gen_code + f"""\ndef {control['function']}({unpack_param_names(header)}, **kwargs) -> None:\n\tkwargs = dict(){create_kwarg_dict(header)}\n\th9.node(uid, **kwargs)
    """
    except KeyError as k:
        print(k)
        print(control['name'])

with open(path.parents[0]/'controls.py', 'w') as f:
    f.write(gen_code)