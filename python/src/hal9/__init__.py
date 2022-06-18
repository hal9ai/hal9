import hal9

from IPython.core.display import display, HTML
import json

def encode(data):
  if (type(data).__name__ == "DataFrame"):
    return data.to_json(orient = 'records')
  else:
    return json.dumps(data)

def create(data, height = 400, **kwargs):
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
