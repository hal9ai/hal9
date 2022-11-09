import json
from typing import Callable, Any, Dict
import os
import sys
import base64
import io
import re
import tempfile

from hal9 import controls
from hal9 import _hal9 as h9

class _Node:
    """
    The base class which defines the backend execution graph

    """

    def __init__(self, uid: str = None, funcs: Dict[str, Callable] = None) -> None:
        self.uid = uid
        self.funcs = funcs
        _register_node(self)

    def evaluate(self, fn: str, *args, **kwargs) -> Any:
        if callable(self.funcs[fn]):
            return self.funcs[fn](*args, **kwargs)
        else:
            return self.funcs[fn]

    def has_fn(self, fn: str) -> bool:
        return fn in self.funcs.keys()


global_nodes: Dict[str, _Node] = dict()
global_data: Dict[str, Any] = dict()


def _register_node(node: _Node) -> None:
    global_nodes[node.uid] = node


def node(uid: str, **kwargs) -> None:
    _Node(uid, funcs=kwargs)


def get(name: str) -> Any:
    """Get some thing that was stored earlier using the set function

    Parameters
    ----------
    name: str
		The variable to get

    Returns
    -------
    x : Any or None
        Returns the object if object was stored with corresponding name earlier otherwise returns None

    """
    if name in global_data.keys():
        return global_data[name]
    else:
        return None


def set(name: str, value: Any) -> Any:
    """Get some thing that was stored earlier using the set function

    Parameters
    ----------
    name: str
		The name the object to get be 
    
    value: Any
        The object that should be saved

    """
    global_data[name] = value
    return value

def __convert_type_request(obj):
    if "<class 'str'>" in str(type(obj)):
        if re.match(r'^data:[a-z]+/[a-z]+;base64', obj) != None:
            contents = re.sub(r'^data:[a-z]+/[a-z]+;base64,', '', obj)
            decoded = base64.b64decode(contents)
            temp = tempfile.NamedTemporaryFile(mode = "wb", delete = False)
            temp.write(decoded)
            temp.close()
            return temp.name
        else:
            return obj
    else:
        return obj

def __convert_type_reply(obj):
    if hasattr(obj, 'savefig'):
        pic_IObytes = io.BytesIO()
        obj.savefig(pic_IObytes, format='png')
        pic_IObytes.seek(0)
        pic_hash = base64.b64encode(pic_IObytes.read())
        pic_str = pic_hash.decode('ascii')
        return "data:image/png;base64," + pic_str
    else:
        return obj

def __process_request(calls: list) -> dict:
    response = dict()
    call_response = list()
    for call in calls:
        try:
            result = None
            if call['node'] in global_nodes.keys():
                node = global_nodes[call['node']]
                if node.has_fn(call['fn_name']):
                    kwargs = dict()
                    for arg in call['args']:
                        kwargs[arg['name']] = __convert_type_request(arg['value'])
                    result = node.evaluate(call['fn_name'], **kwargs)

            result = __convert_type_reply(result)

            call_response.append(
                {'node': call['node'], 'fn_name': call['fn_name'], 'result': result})
        except Exception as e:
            call_response.append(
                {'node': node.uid, 'fn_name': call['fn_name'], 'result': None, 'error': str(e)})
    response['calls'] = call_response
    return response


def __get_designer(**options: Dict) -> str:
    options['designer'] = {
        'persist': 'pipeline',
        'eval': 'eval'
    }
    options = json.dumps(options)
    with open('../r/inst/client.html') as f:
        html = f.read()
    html = html.replace("__options__", options)
    return html


def run_script(path: str, port: int = 8000) -> None:
    import os
    if not os.path.exists(path):
        with open(path, 'w') as f:
            pass

    servercode = """
import uvicorn
from fastapi import FastAPI
import hal9 as h9
fastapp = FastAPI()

@fastapp.post("/eval")
async def eval(calls: list):
    return h9.core.__process_request(calls)
uvicorn.run(fastapp, host="127.0.0.1", port=port)
"""
    with open(path, 'r') as f:
        code = f.read()
    glo = {'port': port}
    code = code + '\n' + servercode
    try:
        exec(code, glo)
    except Exception as e:
        print('runtime_startup_error:', e, file = sys.stderr)

checkbox = controls.checkbox
dropdown = controls.dropdown
file = controls.file
image = controls.image
message = controls.message
number = controls.number
markdown = controls.markdown
slider = controls.slider
textbox = controls.textbox
textarea = controls.textarea
html = controls.html

def start(path: str = '.', port: int = 0, timeout: int = 600, nobrowse: bool = False):
    """Launches an app at the specified directory
	
    Parameters
    ----------
	path: str
		Path to the app
	port: int
		The port to run the app on. Default 0
	timeout: int
		The timeout for each function
	nobrowse: bool
		Whether to open the editor in a browser

	"""
    h9.start(path, port, timeout, nobrowse)

def new(path: str = '.'):
    """Launches an app at the specified directory
	
    Parameters
    ----------
    path: str
		Path where to create the app

    """
    h9.new(path)