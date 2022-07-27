import hal9
import pkg_resources

from IPython.core.display import display, HTML
import json

json.load(open("D:\hal9ai5\scripts\import\json.json"))

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

  def add_step(self, step_name):

    my_file = open(pkg_resources.resource_filename('hal9', 'data/'+step_name+'.txt'))
    step_data = my_file.readlines()

  def show(self, height = 400, **kwargs):
    display(HTML("""<script>
    window.hal9 = {
      data: "",
      pipeline: {
        "steps": """ + self.steps + """",
        "params": """ + self.params + """",
        "outputs": """ + self.outputs + """",
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
