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

class h9:
  """hal9 pipeline class"""

  def __init__(self):
    self.params = {}
    self.outputs = {}
    self.steps = []
    self.html_code = ""
    self.last_step_id = 0

  def add_step(self, step_name, **kwargs):
    """Adds a generic step to a pipeline instance.

    This is 

    >>> pipeline = h9.create()
    >>> pipeline.add_step("load")
    >>> pipeline.show()

    """
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
            element["value"] = encode(parameter_value).replace("\"", "")
          else:
            element["value"] = parameter_value
      else:
        if param_dict[parameter_name]["static"]:
            element["value"] = parameter_value
        else:
            element["value"] = [{"name": parameter_value}]
    
    self.params[new_id] = param_dict

    return(self)

  def show2(self, height = 400, **kwargs):

    a = 1

    html_code = """
      <script src = "https://cdn.jsdelivr.net/npm/hal9@0.2.78/dist/hal9.min.js">
      <div style='width: 100%; padding: 6px; height: 400px'>
        <div id='app'>
        </div>
      </div>
      <script>
        const css = `
          #output {
            display: flex;
            flex-direction: column;
          }`;

        const pipeline_json = {
          "steps": [{"name": "dataframe", "label": "DataFrame", "language": "javascript", "description": "Loads a dataframe", "icon": "fa-light fa-columns-3", "params": {}, "id": 1}],
          "params": {"1": {"dataset": {"name": "dataset", "label": "Dataset", "description": "The dataframe to load", "value": [{"control": "dataframe", "id": 0, "value": [{cyl:1,mpg:2},{cyl:2,mpg:3 }] }], "static": true}}},
          "outputs": {},
          "scripts": [],
          "version": "0.0.1"
        }

        hal9.init({
          iframe: true,
          html: document.getElementById('app'),
          api: "https://cdn.jsdelivr.net/npm/hal9@0.2.78/dist/hal9.min.js",
          css: css,
          editable: true,
          mode: "run",
          pipeline: pipeline_json
        }, {}).then(function(hal9) {
          if (hal9) {
            hal9.load(pipeline_json).then(function(pid) {
              hal9.run(pid, { html: 'output', shadow: false });
            });
          }
        });
      </script>"""

    self.html_code = html_code

  def load(self, dataframe, rebinds):
    """Loads a dataframe

    :param DataFrame dataframe: Table to load
    :param dict rebinds: Possible rebinds to make

    >>> pipeline = h9.create()
    >>> pipeline.load(pandas.DataFrame({"col1": [1,2], "col2": [1,2]}))
    >>> pipeline.show()

    """
    self.add_step("load", dataframe, rebinds)

    return(self)

  def show(self, height = 400, **kwargs):
    """Renders the pipeline content on a notebook.

    This functions produces a HTML display block rendering the pipeline content.

    >>> pipeline = h9.create()
    >>> pipeline.add_step("load")
    >>> pipeline.show()

    """
    display(HTML("""<div id="app"></div><script>        const css = `
          #output {
            display: flex;
            flex-direction: column;
          }`;

        const pipeline_json = {
        "steps": """ + encode(self.steps) + """",
        "params": """ + encode(self.params) + """",
        "outputs": """ + encode(self.outputs) + """",
        scripts": { "1": "data = window.hal9.data" },
        "version": "0.0.1"
      }

        hal9.init({
          iframe: true,
          html: document.getElementById('app'),
          api: "https://cdn.jsdelivr.net/npm/hal9@0.2.78/dist/hal9.min.js",
          css: css,
          editable: true,
          mode: "run",
          pipeline: pipeline_json
        }, {}).then(function(hal9) {
          if (hal9) {
            hal9.load(pipeline_json).then(function(pid) {
              hal9.run(pid, { html: 'output', shadow: false });
            });
          }
        });
      </script>"""))

  def old_show(self, height = 400, **kwargs):
    """Renders the pipeline content on a notebook.

    This functions produces a HTML display block rendering the pipeline content.

    >>> pipeline = h9.create()
    >>> pipeline.add_step("load")
    >>> pipeline.show()

    """
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