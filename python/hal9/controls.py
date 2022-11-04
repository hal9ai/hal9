import hal9 as h9
from typing import Callable, Union

def checkbox(uid: str, label: Union[Callable[..., str], str] = None, checked: Union[Callable[..., bool], bool] = None, on_update: Callable = None, **kwargs) -> None:
	"""Embed a checkbox component

	Parameters
    ----------
	uid: str
		A short string that is a unique identifier. It should match the corresponding component on the front end

	label: Union[Callable[..., str], str]
		The label to apply to the checkbox

	checked: Union[Callable[..., bool], bool]
		The default state of the checkbox, checked if true, unchecked otherwise. Optional

	on_update: Callable
		The function to be run when the value of the checkbox is changed by the user
	kwargs: Dict
		A dictionary of optional keyword arguments

	"""
	kwargs = dict()
	kwargs["label"] = label
	kwargs["checked"] = checked
	kwargs["on_update"] = on_update
	h9.node(uid, **kwargs)
    
def dropdown(uid: str, values: Union[Callable[..., list], list] = None, value: Union[Callable[..., str], str] = None, on_update: Callable = None, **kwargs) -> None:
	"""Embed a dropdown component

	Parameters
    ----------
	uid: str
		A short string that is a unique identifier. It should match the corresponding component on the front end
	values:Union[Callable[..., list], list]
		The values that a dropdown should let the user choose from
	value: Union[Callable[..., str], str]
		The default value of this dropdown
	on_update: Callable
		The function to be run when the value of the dropdown is changed by the user
	kwargs: Dict
		A dictionary of optional keyword arguments

	"""
	kwargs = dict()
	kwargs["values"] = values
	kwargs["value"] = value
	kwargs["on_update"] = on_update
	h9.node(uid, **kwargs)
    
def file(uid: str, caption: Union[Callable[..., str], str] = None, dragDrop: Union[Callable[..., bool], bool] = None, on_update: Callable = None, **kwargs) -> None:
	"""Embed a file upload component

	Parameters
    ----------
	uid : str
		A short string that is a unique identifier. It should match the corresponding component on the front end
	caption:Union[Callable[..., str], str]
		The label to apply to the checkbox
	dragDrop :  Union[Callable[..., bool], bool]
		Whether to allow the user to drag and drop a file to the upload
	on_update : Callable
		The function to be run when the file is updated by the user
	kwargs : Dict
		A dictionary of optional keyword arguments

	"""
	kwargs = dict()
	kwargs["caption"] = caption
	kwargs["dragDrop"] = dragDrop
	kwargs["on_update"] = on_update
	h9.node(uid, **kwargs)
    
def image(uid: str, image: Union[Callable[..., str], str] = None, on_update: Callable = None, **kwargs) -> None:
	"""Embed a file input component

	Parameters
    ----------
	uid : str
		A short string that is a unique identifier. It should match the corresponding component on the front end
	image : str
		Specifies the image for this image
	on_update : Callable
		The function to be run when the file is updated by the user
	kwargs : Dict
		A dictionary of optional keyword arguments

	"""
	kwargs = dict()
	kwargs["image"] = image
	kwargs["on_update"] = on_update
	h9.node(uid, **kwargs)
    
def message(uid: str, message: Union[Callable[..., str], str] = None, title: Union[Callable[..., str], str] = None, mtype: Union[Callable[..., str], str] = None, showIcon: Union[Callable[..., bool], bool] = None, on_update: Callable = None, **kwargs) -> None:
	"""Embed a message element

	Parameters
    ----------
	uid : str
		A short string that is a unique identifier. It should match the corresponding component on the front end
	message : Union[Callable[..., str], str]
		Specifies the image for this image
	title : Union[Callable[..., str], str]
		Specifies the title of the message element
	mType : Union[Callable[..., str], str]
		specifies the message type for this message control
	showIcon : Union[Callable[..., bool], bool]
		specifies whether this message should show an icon or not
	on_update : Callable
		The function to be run when the file is updated by the user
	kwargs : Dict
		A dictionary of optional keyword arguments

	"""
	kwargs = dict()
	kwargs["message"] = message
	kwargs["title"] = title
	kwargs["mtype"] = mtype
	kwargs["showIcon"] = showIcon
	kwargs["on_update"] = on_update
	h9.node(uid, **kwargs)
    
def number(uid: str, label: Union[Callable[..., str], str] = None, value: Union[Callable[..., str], str] = None, on_update: Callable = None, **kwargs) -> None:
	"""Embed a number input component

	Parameters
    ----------
	uid : str
		A short string that is a unique identifier. It should match the corresponding component on the front end
	value : Union[Callable[..., str], str]
		The value of this number input component
	on_update : Callable
		The function to be run when the number input is updated
	kwargs : Dict
		A dictionary of optional keyword arguments

	"""
	kwargs = dict()
	kwargs["label"] = label
	kwargs["value"] = value
	kwargs["on_update"] = on_update
	h9.node(uid, **kwargs)
    
def html(uid: str, rawhtml: Union[Callable[..., str], str] = None, **kwargs) -> None:
	"""Embed any html on the frontend

	Parameters
    ----------
	uid : str
		A short string that is a unique identifier. It should match the corresponding component on the front end
	rawhtml : Union[Callable[..., str], str]
		The html that should form the inner html of the html compenent

	"""
	kwargs = dict()
	kwargs["rawhtml"] = rawhtml
	h9.node(uid, **kwargs)
    
def markdown(uid: str, markdown: Union[Callable[..., str], str] = None, **kwargs) -> None:
	"""Write text to the frontend using markdown

	Parameters
    ----------
	uid : str
		A short string that is a unique identifier. It should match the corresponding component on the front end
	markdown : Union[Callable[..., str], str]
		A markdown like string

	"""
	kwargs = dict()
	kwargs["markdown"] = markdown
	h9.node(uid, **kwargs)
    
def slider(uid: str, value: Union[Callable[..., float], float] = None, min: Union[Callable[..., float], float] = None, max: Union[Callable[..., float], float] = None, step: Union[Callable[..., float], float] = None, on_update: Callable = None, **kwargs) -> None:
	"""Embed a slider component
	
	Parameters
    ----------
	uid : str
		A short string that is a unique identifier. It should match the corresponding component on the front end	
	value : Union[Callable[..., float], float]
		The default value for the slider
	min : Union[Callable[..., float], float]
		The minimum value for the the slider component
	max : Union[Callable[..., float], float]
		The maximum value for the the slider component
	step : Union[Callable[..., float], float]
		The step size of the slider component
	on_update : Callable:
		The function to be run when the slider is updated

	"""
	kwargs = dict()
	kwargs["value"] = value
	kwargs["min"] = min
	kwargs["max"] = max
	kwargs["step"] = step
	kwargs["on_update"] = on_update
	h9.node(uid, **kwargs)
    
def textbox(uid: str, label: Union[Callable[..., str], str] = None, value: Union[Callable[..., str], str] = None, on_update: Callable = None, **kwargs) -> None:
	"""Embed a texbox input component

	Parameters
    ----------
	uid : str
		A short string that is a unique identifier. It should match the corresponding component on the front end
	label : Union[Callable[..., str], str]
		A label for this texbox component
	value : Union[Callable[..., str], str]
		The default value for the textbox
	on_update : Callable
		The function to be run when the on update
		
	"""
	kwargs = dict()
	kwargs["label"] = label
	kwargs["value"] = value
	kwargs["on_update"] = on_update
	h9.node(uid, **kwargs)
    
def textarea(uid: str, on_update: Callable = None, **kwargs) -> None:
	"""Embed a textarea input component

	Parameters
    ----------
	uid : str
		A short string that is a unique identifier. It should match the corresponding component on the front end
	on_update : Callable
		The function to be run when the on update

	"""
	kwargs = dict()
	kwargs["on_update"] = on_update
	h9.node(uid, **kwargs)
    