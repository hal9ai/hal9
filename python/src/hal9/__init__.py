import hal9
import pkg_resources

from IPython.core.display import display, HTML
import json

def encode(data):
  if (type(data).__name__ == "DataFrame"):
    return data.to_json(orient = 'records')
  else:
    return json.dumps(data)

def add_id_to_list(iterable):
    
    id = 0
    for element in iterable:
        element["id"] = id
        id = id+1
    return(iterable)

class hal9:
  """hal9 pipeline class"""

  def __init__(self):
    self.params = {}
    self.outputs = {}
    self.steps = []
    self.last_step_id = 0

  def add_step(self, step_name, **kwargs):

    new_id = self.last_step_id+1

    json_metadata = open(pkg_resources.resource_filename('hal9', 'data/'+step_name+'.js'))
    component = json.load(json_metadata)

    new_step = {k: component.get(k, None) for k in ('name', 'label', 'language', 'description', 'icon')}
    new_step["params"] = {}
    new_step["id"] = new_id

    self.steps.append(new_step)

    step_param_list = component["params"]
    param_names = [param["name"] for param in step_param_list]

    param_dict = dict(zip(param_names, step_param_list))

    print(kwargs)

    for parameter_name, parameter_value in kwargs.items():
      standard_value = param_dict[parameter_name]["value"]

      if ~("static" in param_dict[parameter_name].keys()):
        param_dict[parameter_name]["static"] = True

      if isinstance(standard_value, list):  
        standard_value = add_id_to_list(standard_value)

        id_value = 0
        for element in standard_value:
          element["id"] = id_value
          id_value = id_value + 1

          if element["control"] == "dataframe":
            element["value"] = encode(parameter_value)
          else:
            element["value"] = parameter_value
      else:
        if param_dict[parameter_name]["static"]:
            element["value"] = parameter_value
        else:
            element["value"] = [{"name": parameter_value}]
    
    self.params[new_id] = param_dict

  def show(self, height = 400, **kwargs):
    display(HTML("""<script>
    window.hal9 = {
      data: "",
      pipeline: {
        "steps": """ + encode(self.steps) + """",
        "params": """ + encode(self.params) + """",
        "outputs": """ + encode(self.outputs) + """",
        scripts": { "1": "data = window.hal9.data" },
        "version": "0.0.1"
      }
    }
    </script>
    <script defer src="https://hal9.com/hal9.notebook.js"></script>
    <div style='width: 100%; padding: 6px; height: """ + str(height) + "px'><div id='app'></div></div>"
    ))

def show(data, height = 400, **kwargs):
  display(HTML("""<script>
    window.hal9 = {
      data: """ + encode(data) + """,
      pipeline: {
        "steps": [ { "name": "javascript", "label": "Source", "language": "javascript", "id": 1, } ],
        "params": {}, "outputs": {}, "scripts": { "1": "data = window.hal9.data" },
        "version": "0.0.1"
      }
    }
  </script>
  <script defer src="https://hal9.com/hal9.notebook.js"></script>
  <div style='width: 100%; padding: 6px; height: """ + str(height) + "px'><div id='app'></div></div>"))
