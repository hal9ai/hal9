import hal9
import pkg_resources

from IPython.core.display import display, HTML
import json

def encode(data):
  if (type(data).__name__ == "DataFrame"):
    return data.to_json(orient = 'records')
  else:
    return json.dumps(data)

class hal9:
  """hal9 pipeline class"""

  def __init__(self):
    self.params = []
    self.outputs = []
    self.steps = []
    self.last_step_id = 0

  def add_step(self, step_name, **kwargs):

    new_id = self.last_step_id+1

    json_metadata = open(pkg_resources.resource_filename('hal9', 'data/'+step_name+'.js'))
    component = json.load(json_metadata)

    new_step = {k: component.get(k, None) for k in ('name', 'label', 'language', 'description', 'icon')}
    new_step["params"] = None
    new_step["id"] = new_id

    self.steps.append(new_step)

    param_names = [param["name"] for param in component["params"]]

    param_list = [{"ph": param, "name": param["name"]} for param in component["params"]]
    param_dict = dict(zip(param_names, param_list))

    for parameter_name, parameter_value in kwargs.iteritems():
      standard_value = param_dict[parameter_name]["value"][0]

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
