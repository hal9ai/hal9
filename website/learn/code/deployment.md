---
sidebar_position: 80
---

# Deployment

## Chatbots

Developers can deploy a chatbot to Hal9 using the Hal9 Command Line Interface (**CLI**) as follows:

```bash
pip install hal9

hal9 create chatbot
hal9 deploy chatbot
```

Beside chatbots, you can also deploy and run other content types like images, static websites, Streamlit data apps, web APIs, or you can even send a pull request to [Hal9's GitHub](https://github.com/hal9ai/hal9) project to extend this to any other content type.

## Data Apps

Web Applications (Web Apps) are applications that provide endpoints for us to use with a web browser (Chrome, Safari, Firefox, etc).

```python deploy
import streamlit as st
import random

if st.button("Roll a dice"):
  st.write(f"You rolled a {random.randint(1, 6)}!")
```

When a chatbot generates an application, Hal9 automatically deploys and embeds the application; however, if you have to manually deploy an application you can accomplish this as follows:

```bash
pip install hal9

hal9 create webapp --type streamlit
hal9 deploy webapp --type streamlit
```

## Web APIs

Web APIs are applications that are designed for other computer programs or services to interoperate with, if you wanted to enable other web apps to use your previous app, you would do this as follows:

Always ensure any API's root path `@app.get("/")` function is kept, because Hal9 Web APIs use this endpoint to check the application's status.

Hal9 is able to run Python FastAPI or Flask apps.

### Fast API
```python deploy
from fastapi import FastAPI
import random

app = FastAPI()

@app.get("/")
def read_root():
    return {"success": True}

@app.get("/roll")
async def roll():
    return f"You rolled a {random.randint(1, 6)}!"
```

### Flask API
```python deploy
from flask import Flask, jsonify, request
from asgiref.wsgi import WsgiToAsgi # WSGI compatible with Hal9 launcher
import random

flaskapp = Flask(__name__)

@flaskapp.route("/", methods=['GET'])
def read_root():
    return jsonify({"success": True})

@flaskapp.route("/roll", methods=['GET'])
def roll():
  return f"You rolled a {random.randint(1, 6)}!"

app = WsgiToAsgi(flaskapp)
```

When a chatbot generates an API, Hal9 automatically deploys and embeds the API endpoint; however, if you have to manually deploy an API you can accomplish this as follows:

```bash
pip install hal9

# flask api app creation
hal9 create webapi --type flask
hal9 deploy webapi --type flask

# fast api app creation
hal9 create webapi --type fastapi
hal9 deploy webapi --type fastapi
```

### Customize your application Hal9.yaml

Create Hal9.yaml file in your Hal9 application

#### Any app 

`terminatems: <time-in-miliseconds>` set a pod living in the background for "x" time use this

#### Chatbot
`welcome: <welcome-message>` chatbot welcome message
`color: <hex-color>` chatbot color


