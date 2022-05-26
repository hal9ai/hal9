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

import json
from flask import Flask, request
app = Flask(__name__)

@app.route('/', methods = [ 'POST' ])
def index():
  return json.dumps({
    'records': len(request.json['data']),
    'email': request.json['sometext']
  })
