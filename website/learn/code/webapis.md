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

For this to work, all your frontend has to do is call your backend in a way that all requests are correctly routed via the **Hal9 proxy**. In this call, your frontend authenticates to the backend by means of your Hal9 token, independently of whichever external provider that backend will make use of. For the Hal9 proxy to know which key is to be used, you append a query parameter holding the provider's name.

On being called, the proxy then looks up the key pertaining to the external provider in question, and calls your backend passing that key in a dedicated header. In addition, it may also pass any other service-specific headers.

The backend then extracts authentication (and possibly other) information from the header and uses it in its service call(s). See the detailed technical information below for _how to call the Hal9 proxy_.

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

## Call Your Backend Via the Hal9 Proxy

By way of illustration, here you see a simple backend that, when we call its `call-openai` endpoint passing a prompt and a model, will issue a call to OpenAI and send the LLM's response back to the client:

### Example: External Service: OpenAI

```python
from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel

openai_url = "https://api.openai.com/v1/"

app = FastAPI()

class OpenaiRequest(BaseModel):
    prompt: str
    model: str = "gpt-4o-mini"

@app.get("/")
def root():
    return {"success": True}
    
@app.post("/ask-openai")
async def ask_openai(request: OpenaiRequest, authorization: str = Header(...) ):   
    # your OpenAI key, in the format you then have to use in the call to OpenAI
    # format is: authorization: Bearer <key>
    try:
        openai_key = authorization.split(" ")[1]
    except IndexError:
        raise HTTPException(
            status_code=401,
            detail="Did not receive OpenAI key"
         ) 
    try:
        from openai import OpenAI
        client = OpenAI(
            base_url=openai_url,
            api_key=openai_key 
        )
        response = client.chat.completions.create(
            model=request.model,
            messages=[{"role": "user", "content": request.prompt}],
            stream=False
        )    
        return response.choices[0].message.content    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error: {str(e)}"
        )     
```

In this code, note how the `openai_key` extracted from the `authorization` header is _not_ your Hal9 token, but the OpenAI token sent by the Hal9 proxy. A client call could look like this (we use `curl` for simplicity):

```bash
HAL9_TOKEN=<yourtoken>
curl -X POST https://api.hal9.com/proxy?server=https%3A//api.hal9.com/<yourusername>/openai/proxy/ask-openai&service=openai \
-H "Authorization: Bearer ${HAL9_TOKEN}" \
-H "Content-Type: application/json" \
-d '{"prompt": "Comment t'\''appelles-tu?", "model": "gpt-4o-mini"}'
```

In the URL, pay attention to the following constituents:

1. The call to your backend is routed via the Hal9 proxy: `https://api.hal9.com/proxy?[...]`
2. In the query string, you pass two required parameters:
   - `server=[path to your backend]`. In the `server` parameter, you send the URL your API resides on. Note how this path again starts with `api.hal9.com`, and again contains `proxy` - though this time, not directly following the domain, but between the _location your backend has been deployed to and the endpoint_. Note also that the `server` parameter has to be **urlencoded**. This is to separate any query parameters you might want to pass to your backend from parameters (like `service`) that are meant for the Hal9 proxy.
   - `service=[the provider your backend will call]`. Some other examples: `service=googleapis`, `service=firecrawl`, `service=anthropic`, etc.
3. Your frontend authenticates to your backend using the Hal9 token.

This workflow completely liberates your code (frontend _and_ backend) from hardcoding authorization information for external providers. 

Here is an example where the provider is not an LLM.

### Example: External Service: Google Maps (Geocoding)

In this example, your backend retrieves information from one of the many Google APIS, namely, the geocoding endpoint in Maps. Again, the proxy sends the authorization key required; but there are two aspect deserving attention here:
1. For most Google APIs, the header to be used is named `x-goog-api-key`. In consequence, the proxy sends your backend the key in that same form. This will happen in general: The proxy sends you the token in a header named just like the one you will need to use in the external call. Anthropic, for instance, expects an `x-api-key`, and this is what you'll get from Hal9.
2. However, here we have a special case. Authentication in a geocoding request does not rely on a header, but on a query parameter, of name `key`. The proxy only knows you'll call some Google API, but not which one - so you'll still receive the key in the usual header, but have to pack it as a query parameter in your geocoding request.

```python
from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
import requests

app = FastAPI()

class GeocodingRequest(BaseModel):
    address: str  

@app.get("/")
def root():
    return {"success": True}
    
@app.post("/geocode")
async def geocode(
    data: GeocodingRequest,
    # Google APIS in general ask for a header named x-goog-api-key,
    # so this is the form in which the proxy sends the key ...
    x_goog_api_key: str = Header(..., alias="x-goog-api-key")
):
    try:
        # ... BUT the geocoding endpoint needs to receive a query parameter named key instead
        geocoding_url = f"https://maps.googleapis.com/maps/api/geocode/json?address={data.address}&key={x_goog_api_key}"
        
        response = requests.get(geocoding_url)
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

In sum, when coding your backend, you do not need to hardcode authorization information - but you _do_ need to know how to correctly authenticate with the external service.

## Indicate a Time Until Which to Reuse Cached Responses

In your frontend call, you can append to the query a `cache` parameter that tells the Hal9 proxy until what time to _not_ call your backend (which would then call some external service), but to return a cached result instead.

To potentially retrieve the last cached response for the example request used above, you would modify the command like this:

```bash
HAL9_TOKEN=<yourtoken>
CACHE_UNTIL=$(( $(date +%s) + 600 ))
curl -X POST https://api.hal9.com/proxy?server=https%3A//api.hal9.com/<yourusername>/openai/proxy/ask-openai&service=openai&cache=${CACHE_UNTIL} \
-H "Authorization: Bearer ${HAL9_TOKEN}" \
-H "Content-Type: application/json" \
-d '{"prompt": "¿Cómo te llamas?", "model": "gpt-4o-mini"}'
```

Here `CACHE_UNTIL` is a timestamp telling the Hal9 proxy: "If you have a result cached for this query, and it has a TTL (_Time to Live_) in the future (as seen from this very moment), then no need to forward to the `server` I'm passing; just give me what's in the cache." 

It is important to be aware of _whose_ response actually is being cached here: It is your backend's, not the raw answer from OpenAI. That way, you not just improve performance (halving the number of calls from your frontend to the Hal9 proxy): you also potentially spare your backend from repeatedly performing ressource-consuming (post-) processing, calculation, or aggregation routines.

In case you _do_ want to cache just external, not your own backend's responses, that is no problem either. In this case, you append `cache=` in your backend instead. However, in this case, the call to OpenAI _must go via the Hal9 proxy_, like so:

```python
openai_url = f"https://api.hal9.com/proxy?server=https://api.openai.com/v1&cache={CACHE_UNTIL}"
```

Sometimes, you have to poll a service repeatedly until a response is ready. You want to make sure you cache the final result, so you need to pass `cache=`. However, say the first answer has a `status` of `in_progress`, telling you to keep polling. Since you told the proxy to cache the reply, your second call does _not_ result in the service being polled. Instead, you receive the cached response, saying `in_progress` - this way, you never see the actual artifact generated by the service. 

The solution here is to use another proxy parameter, `invalidate` (standalone or as `invalidate=true`). This asks the proxy to disregard any cached responses there may be. In your polling loop, you do the following:
1. Initially, you append only `cache=` to your query.
2. In follow-up calls, you append both `cache=` _and_ `invalidate`, indicating that yes, you'd like the result to be cached (in case the artifact is already available), but no, you do not want to retrieve anything from cache yourself. 
3. Every time, you check whether the desired result is there already. If yes, you stop polling, leaving intact the last cached response.
