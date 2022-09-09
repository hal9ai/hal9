import json
from typing import Callable, Any
import os
import sys

class _Node:
    """
    The base class which defines the backend execution graph
    """
    def __init__(self, uid:str =  None, funcs: dict[str, Callable] = None) -> None:
        self.uid = uid
        self.funcs = funcs
        _register_node(self)
    
    def evaluate(self, fn: str, *args, **kwargs):
        return self.funcs[fn](*args, **kwargs)

global_nodes:dict[str, _Node] = dict()
global_data:dict[str, Any] = dict()

def _register_node(node: _Node) -> None:
    global_nodes[node.uid] = node
    
def node(uid: str, **kwargs) -> None:
    _Node(uid, funcs=kwargs)


def get(x: str) -> _Node:
    if x in global_data:
        return global_data[x]
    else:
        return None
                                                                                                                            
def set(name: str, value: Any) -> None:
    global_data[name] = value
    return value

    
def __process_request(request: dict) -> None:
    response = dict()
    for uid in request.keys():
        node = global_nodes[uid]
        fn_args = request[uid]
        fns = fn_args.keys()
        if not len(fn_args):
            results = node.evaluate('values')
            response[uid]= {'result': results}
        else:
            fn = list(fn_args.keys())[0]
            args = fn_args[fn]
            response[uid] = {'result': node.evaluate('event', fn, args)}
    return response

def __get_designer(**options: dict) -> str:
    options['designer'] = {
        'persist': 'pipeline',
        'eval': 'eval'
    }
    options = json.dumps(options)
    with open('../r/inst/client.html') as f:
        html = f.read()
    html = html.replace("__options__", options)
    return html

def start(path:str, port:int = 8000) -> None:
    from typing import Any, Dict, Union
    import uvicorn
    from fastapi import FastAPI
    import hal9 as h9
    import os
    from fastapi.responses import HTMLResponse, PlainTextResponse
    from pydantic import BaseModel
    import webbrowser
    if not os.path.exists(path):
        os.makedirs(path)

    sys.path.append(path)

    if not os.path.exists(os.path.join(path, 'app.py')):
        with open(os.path.join(path, 'app.py'), 'w+') as fp:
            pass
    import app
    fastapp = FastAPI()

    class Manifest(BaseModel):
        manifests: Dict[Any, Union[Any, None]]

    @fastapp.get('/pipeline', response_class=PlainTextResponse)
    async def get_pipeline():
        with open(os.path.join(path, 'app.json'), 'r') as f:
            return f.read()

    @fastapp.post('/pipeline', response_class=PlainTextResponse)
    async def write_pipeline(req:dict):
        with open(os.path.join(path, 'app.json'), 'w+') as f:
            f.write(json.dumps(req))
        return "{}"
    @fastapp.get('/', response_class=HTMLResponse)
    async def run_client():
        return h9.__get_designer(mode = "run")

    @fastapp.get('/design', response_class=HTMLResponse)
    async def get_designer():
        return h9.__get_designer(mode = "design")

    @fastapp.post("/eval")
    async def eval(manifest: Manifest):
        return h9.__process_request(manifest)
    a = webbrowser.open('http://127.0.0.1:'+str(port)+'/design')
    print (a)
    uvicorn.run(fastapp, host="127.0.0.1", port=port)
    