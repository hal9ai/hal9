---
sidebar_position: 80
---

# AI-Powered Backend Applications 

With Hal9, you can comfortably create and run **cost- and performance-optimized backend applications** that make use of generative AI, as well as a number of popular API services, to provide _completely customized_ data and resources to interested callers such as websites or batch jobs.

Before we go into technical details, here is a high-level summary of how this works:

## What: Architecture/Purpose

A popular use case for Hal9-powered backends is where you have a user-facing web _frontend_ operating on bespoke data. For smooth UI performance, the frontend obtains its data from a dedicated _backend_ that, making use of, e.g., LLMs, photo-, map-, or other data-supplying services, can produce aggregates or artifacts of arbitrary sophistication. 

## Why (1): Easy Integration of AI/Web Service Providers

In addition to the usual comfort offered by the Hal9 functionality and library integrations, in such backend applications you profit from offloading all your external-service authentication to the Hal9 software that, in turn, is _your backend's backend_.

In your backend, you don't store the tokens or keys needed to authenticate to external services. When calling a service, you just pass in your Hal9 token, independently of actual service called. This token you don't hard code either - you conveniently retrieve it from the environment.

For this to work, your backend has to run all service requests via the **Hal9 proxy**. The proxy then checks your token, and forwards your request to the service, replacing it by the corresponding provider key. In addition, it may also pass any other service-specific headers or query parameters required. See the detailed technical information below for _how to use the Hal9 proxy_ in your backend.

## Why (2): Call Optimization / Caching

When you call service providers like OpenAI or Google via the Hal9 proxy, you can indicate a point in time until which the returned data will be cached. Then when during this time period, a caller issues a request that normally would cause the external service to be called again - increasing both service cost and execution time - the cached result will be used instead. See below for an illustration of how to use the cache.

# In-depth HowTo

We now show how to create a backend application on Hal9, elaborating on the above three focus points.

## A Backend is a Python API

With Hal9, you can use [FastAPI](https://fastapi.tiangolo.com/) or [Flask](https://flask.palletsprojects.com/en/stable/) to create a web API.

Here's a simple backend that will roll dice for you. First, the FastAPI version:

```python
from fastapi import FastAPI
import random

app = FastAPI()

@app.get("/")
def root():
    return {"success": True}

@app.get("/roll")
async def roll():
    return f"You rolled a {random.randint(1, 6)}!"
```

Next, the Flask way:

```python
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

Whichever framework you choose, always ensure you have an endpoint for the root path - `@app.get("/")` - for callers to check the application's status.

To generate a simple FastAPI/Flask-using Hal9 API, issue either of the below calls:

```bash
# if not installed yet
pip install hal9
# flask api app creation
hal9 create webapi --type flask
# fast api app creation
hal9 create webapi --type fastapi
```
To deploy your Hal9 API, you then do, correspondingly

```bash
pip install
hal9 deploy webapi --type flask
hal9 deploy webapi --type fastapi
```

## Route Your Service Calls Via the Hal9 Proxy

By way of illustration, here you see a simple backend that, when we call its `call-openai` endpoint passing a prompt and a model, will issue a request to OpenAI and send the LLM's response back to the client:

### Example: External Service: OpenAI

```python
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import os

hal9_server = os.getenv('HAL9_SERVER')
hal9_token = os.getenv('HAL9_TOKEN')

openai_url = "https://api.openai.com/v1/chat/completions"
proxy_url = f"{hal9_server}/proxy?server={openai_url}"

app = FastAPI()

class OpenaiRequest(BaseModel):
    prompt: str
    model: str = "gpt-4o-mini"

@app.get("/")
def root():
    return {"success": True}
    
@app.post("/ask-openai")
async def ask_openai(request: Request, data: OpenaiRequest):    
    try:
        from openai import OpenAI
        client = OpenAI(
            base_url=proxy_url,
            api_key=hal9_token 
        )
        response = client.chat.completions.create(
            model=data.model,
            messages=[{"role": "user", "content": data.prompt}],
            stream=False
        )
    
        return response.choices[0].message.content
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error: {str(e)}"
        ) 
```

In calling OpenAI, the proxy does not just determine the correct key to send. It also ensures it gets sent in the right format - for OpenAI, that is an `Authorization` header with value `Bearer: yourtoken`.

A client call to this backend could look like this (we use `curl` for simplicity):

```bash
HAL9_TOKEN="yourtoken"
HAL9_SERVER="https://api.hal9.com"
curl -X POST "${HAL9_SERVER}/yourusername/openai/proxy/ask-openai" \
     -H "Authorization: Bearer ${HAL9_TOKEN}" \
     -H "Content-Type: application/json" \
     -d '{"prompt": "Comment t'\''appelles-tu?", "model": "gpt-4o-mini"}'
```

In the URL, pay **special attention to the** `proxy` **path element** between the application name (the name you used to deploy the backend) and the endpoint. This is **required** for your backend to be able to make use of services like LLMs, search products, or the like.
Also, the server URL is _not_ `hal9.com`, but `api.hal9.com`. 

To authenticate to your backend, your frontend sends the Hal9 token.

Summing up, this workflow completely liberates your code (frontend _and_ backend) from hardcoding authorization information for external providers. 

Here is an example where the provider is not an LLM, and where you see even more clearly the convenience of offloading authentication to the proxy.

### Example: External Service: Google Maps (Geocoding)

Google APIs differ in how they expect you to authenticate. Some want you to send a header of name  `x-goog-api-key`. Geocoding, in contrast, requires a query parameter of name `key`. If not using Hal9, you'd have to store that and append it to all your queries - when going through the Hal9 proxy, however, you can just disregard that requirement.

```python
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import httpx
import os
import urllib.parse

hal9_server = os.getenv('HAL9_SERVER')
hal9_token = os.getenv('HAL9_TOKEN')
geocoding_base_url = "https://maps.googleapis.com/maps/api/geocode/json"

app = FastAPI()

class GeocodingRequest(BaseModel):
    address: str

@app.get("/")
def root():
    return {"success": True}

@app.post("/geocode")
async def geocode(request: Request, data: GeocodingRequest):
    try:
        encoded_address = urllib.parse.quote(data.address)
        geocoding_url = f"{geocoding_base_url}?address={encoded_address}"
        proxy_url = f"{hal9_server}/proxy?server={geocoding_url}"

        async with httpx.AsyncClient() as client:
            response = await client.get(
                proxy_url,
                headers={"Authorization": f"Bearer {hal9_token}"}
            )

        if response.status_code != 200:
            raise HTTPException(
                status_code=502,
                detail=f"Geocoding error: {response.text}"
            )

        return response.json()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error: {str(e)}"
        )
```

A frontend call to this backend could look like this:

```bash
HAL9_TOKEN="yourtoken"
HAL9_SERVER="https://api.hal9.com"
curl -X POST "${HAL9_SERVER}/yourusername/googlemaps/proxy/geocode" \
     -H "Authorization: Bearer ${HAL9_TOKEN}" \
     -H "Content-Type: application/json" \
     -d '{"address": "Roquebrun,France"}'
```

Again, note the `proxy` in the URL.

## Indicate a Time Until Which to Reuse Cached Responses

When calling services from your backend, you can append a `cache` parameter that tells the Hal9 proxy until when _not_ call the service again, but to return a cached result instead.

To illustrate, we just need to minimally modify the code examples. First, caching the OpenAI response for 10 minutes:

```python
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import os
import time

hal9_server = os.getenv('HAL9_SERVER')
hal9_token = os.getenv('HAL9_TOKEN')

openai_url = "https://api.openai.com/v1/chat/completions"
cache_until = int(time.time()) + 600 # in 10 mins
proxy_url = f"{hal9_server}/proxy?server={openai_url}&cache={cache_until}"

app = FastAPI()

class OpenaiRequest(BaseModel):
    prompt: str
    model: str = "gpt-4o-mini"

@app.get("/")
def root():
    return {"success": True}
    
@app.post("/ask-openai")
async def ask_openai(request: Request, data: OpenaiRequest):    
    try:
        from openai import OpenAI
        client = OpenAI(
            base_url=proxy_url,
            api_key=hal9_token 
        )
        response = client.chat.completions.create(
            model=data.model,
            messages=[{"role": "user", "content": data.prompt}],
            stream=False
        )
    
        return response.choices[0].message.content
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error: {str(e)}"
        )
```

Analogously, for geocoding:

```python
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import httpx
import os
import time
import urllib.parse

hal9_server = os.getenv('HAL9_SERVER')
hal9_token = os.getenv('HAL9_TOKEN')

geocoding_base_url = "https://maps.googleapis.com/maps/api/geocode/json"
cache_until = int(time.time()) + 600

app = FastAPI()

class GeocodingRequest(BaseModel):
    address: str

@app.get("/")
def root():
    return {"success": True}

@app.post("/geocode")
async def geocode(request: Request, data: GeocodingRequest):
    try:
        encoded_address = urllib.parse.quote(data.address)
        geocoding_url = f"{geocoding_base_url}?address={encoded_address}"
        proxy_url = f"{hal9_server}/proxy?server={geocoding_url}&cache={cache_until}"

        async with httpx.AsyncClient() as client:
            response = await client.get(
                proxy_url,
                headers={"Authorization": f"Bearer {hal9_token}"}
            )

        if response.status_code != 200:
            raise HTTPException(
                status_code=502,
                detail=f"Geocoding error: {response.text}"
            )

        return response.json()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error: {str(e)}"
        )
```

Sometimes, you have to poll a service repeatedly until a response is ready. You want to make sure you cache the final result, so you need to pass `cache=`. However, say the first answer has a `status` of `in_progress`, telling you to keep polling. Since you told the proxy to cache the reply, your second call does _not_ result in the service being polled. Instead, you receive the cached response, saying `in_progress` - this way, you never see the actual artifact generated by the service. 

The solution here is to use another proxy parameter, `invalidate` (standalone or as `invalidate=true`). This asks the proxy to disregard any cached responses there may be. In your polling loop, you do the following:
1. Initially, you append only `cache=` to your query.
2. In follow-up calls, you append both `cache=` _and_ `invalidate`, indicating that yes, you'd like the result to be cached (in case the artifact is already available), but no, you do not want to retrieve anything from cache yourself. 
3. Every time, you check whether the desired result is there already. If yes, you stop polling, leaving intact the last cached response.
