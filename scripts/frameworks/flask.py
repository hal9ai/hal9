##
## input: [ data ]
## output: [ data ]
## params:
##   - name: sometext
##     label: Some Text
##     value:
##       - control: textbox
##         value: 'test'
## environment: worker
## cache: true
##

import pandas as pd

import json
from flask import Flask, request, Response
app = Flask(__name__)

@app.route('/', methods = [ 'POST' ])
def index():
  data = pd.DataFrame(request.json['data'])
  jsonres = json.dumps(
    { 'data': data },
    default = lambda df: json.loads(df.to_json(orient = 'records'))
  )
  return Response(jsonres, mimetype='application/json')
