import hal9 as h9
from typing import Callable

def checkbox(uid: str, label: Callable = None, checked: Callable = None, on_update: Callable = None, **kwargs) -> None:
	kwargs = dict()
	kwargs["label"] = label
	kwargs["checked"] = checked
	kwargs["on_update"] = on_update
	h9.node(uid, **kwargs)
    
def dropdown(uid: str, values: Callable = None, value: Callable = None, on_update: Callable = None, **kwargs) -> None:
	kwargs = dict()
	kwargs["values"] = values
	kwargs["value"] = value
	kwargs["on_update"] = on_update
	h9.node(uid, **kwargs)
    
def file(uid: str, caption: Callable = None, dragDrop: Callable = None, on_update: Callable = None, **kwargs) -> None:
	kwargs = dict()
	kwargs["caption"] = caption
	kwargs["dragDrop"] = dragDrop
	kwargs["on_update"] = on_update
	h9.node(uid, **kwargs)
    
def image(uid: str, image: Callable = None, on_update: Callable = None, **kwargs) -> None:
	kwargs = dict()
	kwargs["image"] = image
	kwargs["on_update"] = on_update
	h9.node(uid, **kwargs)
    
def message(uid: str, message: Callable = None, title: Callable = None, mtype: Callable = None, showIcon: Callable = None, on_update: Callable = None, **kwargs) -> None:
	kwargs = dict()
	kwargs["message"] = message
	kwargs["title"] = title
	kwargs["mtype"] = mtype
	kwargs["showIcon"] = showIcon
	kwargs["on_update"] = on_update
	h9.node(uid, **kwargs)
    
def number(uid: str, label: Callable = None, value: Callable = None, on_update: Callable = None, **kwargs) -> None:
	kwargs = dict()
	kwargs["label"] = label
	kwargs["value"] = value
	kwargs["on_update"] = on_update
	h9.node(uid, **kwargs)
    
def html(uid: str, rawhtml: Callable = None, **kwargs) -> None:
	kwargs = dict()
	kwargs["rawhtml"] = rawhtml
	h9.node(uid, **kwargs)
    
def markdown(uid: str, markdown: Callable = None, **kwargs) -> None:
	kwargs = dict()
	kwargs["markdown"] = markdown
	h9.node(uid, **kwargs)
    
def slider(uid: str, value: Callable = None, min: Callable = None, max: Callable = None, step: Callable = None, on_update: Callable = None, **kwargs) -> None:
	kwargs = dict()
	kwargs["value"] = value
	kwargs["min"] = min
	kwargs["max"] = max
	kwargs["step"] = step
	kwargs["on_update"] = on_update
	h9.node(uid, **kwargs)
    
def textbox(uid: str, label: Callable = None, value: Callable = None, on_update: Callable = None, **kwargs) -> None:
	kwargs = dict()
	kwargs["label"] = label
	kwargs["value"] = value
	kwargs["on_update"] = on_update
	h9.node(uid, **kwargs)
    
def textarea(uid: str, on_update: Callable = None, **kwargs) -> None:
	kwargs = dict()
	kwargs["on_update"] = on_update
	h9.node(uid, **kwargs)
    