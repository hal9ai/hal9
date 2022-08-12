import json
from typing import Callable, Any

class _Node:
    """
    The base class which defines the backend execution graph
    """
    def __init__(self, uid:str=  None, kind:str = None, **funcs) -> None:
        self.uid = uid
        self.type = kind
        self.funcs = funcs
        _register_node(self)
    
    def evaluate(self, fn, fn_args):
        return self.funcs[fn](*fn_args)

global_nodes = dict()
global_data = dict()

def _register_node(node: _Node) -> None:
    global_nodes[node.uid] = node
    
def dropdown(name: str, values: Callable[..., list], on_update = None) -> _Node:
    """
    Write the 
    """
    return _Node(name, kind = 'dropdown', main = values, on_update=on_update)

def get(x: str) -> _Node:
    return global_data[x]

def set(name: str, value: Any) -> None:
    global_data[name] = value
    return value

def code(uid: str, codefunc: Callable[..., str]) -> _Node:
    return _Node(uid = uid, kind = 'pycode', main = codefunc)
    
def __process_request(request: dict) -> None:
    uids = request.keys()
    response = dict()
    for uid in uids:
        node = global_nodes[uid]
        fn_args = request[uid]
        if not len(fn_args):
            fn = 'main'
            args = []
        else:
            fn = list(fn_args.keys())[0]
            args = list(fn_args.items())
        response[uid] = {'result': node.evaluate(fn, args),
                        'type': node.type}
    return response

def __get_designer(**options: dict) -> str:
    options = json.dumps(options)
    with open('../../r/inst/client.html') as f:
        html = f.read()
    html = html.replace("__options__", options)
    return html

