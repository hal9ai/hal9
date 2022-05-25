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
from flask import Flask
app = Flask(__name__)

@app.route('/', methods = [ 'POST' ])
def index():
    return json.dumps({'name': 'alice', 'email': 'alice@test.com'})
