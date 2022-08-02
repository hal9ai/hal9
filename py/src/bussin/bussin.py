import dill as pickle

class _Node:
    def __init__(self, uid:str=  None, kind:str = None, **funcs) -> None:
        self.uid = uid
        self.type = kind
        self.funcs = funcs
        __register_node(self)
    
    def evaluate(self, fn, args):
        return self.funcs[fn](*args)

global_nodes = dict()
global_data = dict()

def __register_node(node: _Node) -> None:
    global_nodes[node.uid] = node
    
def dropdown(uid, values, on_update = None) -> _Node:
    return _Node(uid, kind = 'Dropdown', main = values, on_update=on_update)


def get(x: str) -> _Node:
    return global_data[x]

def set(name: str, value) -> None:
    global_data[name] = value

def code(uid, codefunc) -> _Node:
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
            args = list(fn_args.items())[0]
        response[uid] = node.evaluate(fn, args)
    return response

