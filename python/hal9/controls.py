import hal9 as h9
from typing import Callable, Union

def checkbox(uid: str, label: Union[Callable[..., str], str] = None, checked: Union[Callable[..., bool], bool] = None, on_update: Callable = None, **kwargs) -> None:
	kwargs = dict()
	kwargs["label"] = label
	kwargs["checked"] = checked
	kwargs["on_update"] = on_update
	h9.node(uid, **kwargs)
    
def dropdown(uid: str, values: Union[Callable[..., list], list] = None, value: Union[Callable[..., str], str] = None, on_update: Callable = None, **kwargs) -> None:
	kwargs = dict()
	kwargs["values"] = values
	kwargs["value"] = value
	kwargs["on_update"] = on_update
	h9.node(uid, **kwargs)
    
def file(uid: str, caption: Union[Callable[..., str], str] = None, dragDrop: Union[Callable[..., bool], bool] = None, on_update: Callable = None, **kwargs) -> None:
	kwargs = dict()
	kwargs["caption"] = caption
	kwargs["dragDrop"] = dragDrop
	kwargs["on_update"] = on_update
	h9.node(uid, **kwargs)
    
def image(uid: str, image: Union[Callable[..., str], str] = None, on_update: Callable = None, **kwargs) -> None:
	kwargs = dict()
	kwargs["image"] = image
	kwargs["on_update"] = on_update
	h9.node(uid, **kwargs)
    
def message(uid: str, message: Union[Callable[..., str], str] = None, title: Union[Callable[..., str], str] = None, mtype: Union[Callable[..., str], str] = None, showIcon: Union[Callable[..., bool], bool] = None, on_update: Callable = None, **kwargs) -> None:
	kwargs = dict()
	kwargs["message"] = message
	kwargs["title"] = title
	kwargs["mtype"] = mtype
	kwargs["showIcon"] = showIcon
	kwargs["on_update"] = on_update
	h9.node(uid, **kwargs)
    
def number(uid: str, label: Union[Callable[..., str], str] = None, value: Union[Callable[..., str], str] = None, on_update: Callable = None, **kwargs) -> None:
	kwargs = dict()
	kwargs["label"] = label
	kwargs["value"] = value
	kwargs["on_update"] = on_update
	h9.node(uid, **kwargs)
    
def html(uid: str, rawhtml: Union[Callable[..., str], str] = None, **kwargs) -> None:
	kwargs = dict()
	kwargs["rawhtml"] = rawhtml
	h9.node(uid, **kwargs)
    
def markdown(uid: str, markdown: Union[Callable[..., str], str] = None, **kwargs) -> None:
	kwargs = dict()
	kwargs["markdown"] = markdown
	h9.node(uid, **kwargs)
    
def slider(uid: str, value: Union[Callable[..., int], int] = None, min: Union[Callable[..., int], int] = None, max: Union[Callable[..., int], int] = None, step: Union[Callable[..., int], int] = None, on_update: Callable = None, **kwargs) -> None:
	kwargs = dict()
	kwargs["value"] = value
	kwargs["min"] = min
	kwargs["max"] = max
	kwargs["step"] = step
	kwargs["on_update"] = on_update
	h9.node(uid, **kwargs)
    
def textbox(uid: str, label: Union[Callable[..., str], str] = None, value: Union[Callable[..., str], str] = None, on_update: Callable = None, **kwargs) -> None:
	kwargs = dict()
	kwargs["label"] = label
	kwargs["value"] = value
	kwargs["on_update"] = on_update
	h9.node(uid, **kwargs)
    
def textarea(uid: str, on_update: Callable = None, **kwargs) -> None:
	kwargs = dict()
	kwargs["on_update"] = on_update
	h9.node(uid, **kwargs)
    