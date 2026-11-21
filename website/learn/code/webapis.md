---
sidebar_position: 80
---

# AI-Powered Backend Applications

With `hal9`, you can build **cost- and performance-optimized backend applications** that use generative AI and popular API services to provide customized data and resources to callers such as websites or batch jobs.

:::info Hal9 Platform is transitioning to Cloudish
New backends should deploy to [Cloudish](https://cloudish.ai) as containers. The legacy Hal9 proxy and `HAL9_TOKEN` belong to the legacy Hal9 Platform, which is read-only while it transitions; use provider API keys with Cloudish secrets instead.
:::

## What: Architecture/Purpose

A popular use case is a user-facing web _frontend_ operating on bespoke data. For smooth UI performance, the frontend obtains its data from a dedicated _backend_ that, using LLMs, photo-, map-, or other data-supplying services, can produce aggregates or artifacts of arbitrary sophistication.

## A Backend is a Python API

You can use [FastAPI](https://fastapi.tiangolo.com/) or [Flask](https://flask.palletsprojects.com/en/stable/) to create a web API. Here is a simple backend that rolls dice.

The FastAPI version:

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

The Flask version:

```python
from flask import Flask, jsonify
import random

app = Flask(__name__)

@app.route("/", methods=["GET"])
def read_root():
    return jsonify({"success": True})

@app.route("/roll", methods=["GET"])
def roll():
    return f"You rolled a {random.randint(1, 6)}!"
```

Whichever framework you choose, always keep an endpoint for the root path, `@app.get("/")` or `@app.route("/")`, so callers and platform health checks can verify the application is running.

Run the API locally with:

```bash
# FastAPI
pip install fastapi uvicorn
uvicorn app:app --host 0.0.0.0 --port 8080

# Flask
pip install flask
flask --app app run --host 0.0.0.0 --port 8080
```

## Provider Keys

Keep provider credentials out of your code and out of the container image:

- Locally, read them from environment variables.
- In production, add them as [Cloudish secrets](deployment.md). Cloudish injects them into the container at runtime.

For example, this backend calls OpenAI using `OPENAI_API_KEY`:

```python
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import OpenAI

app = FastAPI()
client = OpenAI(api_key = os.environ["OPENAI_API_KEY"])

class OpenaiRequest(BaseModel):
    prompt: str
    model: str = "gpt-4o-mini"

@app.get("/")
def root():
    return {"success": True}

@app.post("/ask-openai")
async def ask_openai(data: OpenaiRequest):
    try:
        response = client.chat.completions.create(
            model = data.model,
            messages = [{"role": "user", "content": data.prompt}],
            stream = False,
        )
        return response.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
```

A client call looks like this:

```bash
curl -X POST "http://localhost:8080/ask-openai" \
     -H "Content-Type: application/json" \
     -d '{"prompt": "Comment t'\''appelles-tu?", "model": "gpt-4o-mini"}'
```

## Example: Google Maps Geocoding

The same pattern works for non-LLM providers. Google's Geocoding API expects a `key` query parameter, which you read from the environment:

```python
import os
import httpx
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class GeocodingRequest(BaseModel):
    address: str

@app.get("/")
def root():
    return {"success": True}

@app.post("/geocode")
async def geocode(data: GeocodingRequest):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://maps.googleapis.com/maps/api/geocode/json",
            params = {
                "address": data.address,
                "key": os.environ["GOOGLE_MAPS_API_KEY"],
            },
        )

    if response.status_code != 200:
        raise HTTPException(status_code=502, detail=f"Geocoding error: {response.text}")

    return response.json()
```

## Caching

External services can be slow and expensive. Cache responses in your backend with a library such as [`cachetools`](https://cachetools.readthedocs.io/):

```python
from cachetools import TTLCache

cache = TTLCache(maxsize = 1000, ttl = 600)  # reuse responses for 10 minutes
```

Look up the cache before calling the provider, and store the result afterward. If you poll a service until an artifact is ready, cache only the final response so intermediate statuses do not get stuck in the cache.

## Deploy to Cloudish

Package the API as a container with a `Dockerfile` at the root of the project. The server must listen on `0.0.0.0` and on the port you give Cloudish (8080 by default).

Ask your AI coding agent to build the `Dockerfile` and deploy it, or follow the manual steps in [Deployment](deployment.md). Remember to:

- Add `OPENAI_API_KEY`, `GOOGLE_MAPS_API_KEY`, and other credentials as Cloudish secrets.
- Deploy with `alwaysOn: true` if the API must answer requests immediately.
- Keep the root health endpoint.

## Legacy Hal9 Platform

Older Hal9 backends routed provider calls through `https://api.hal9.com/proxy/...` and authenticated callers with `HAL9_TOKEN`. That proxy belongs to the legacy Hal9 Platform, which is read-only while it transitions to Cloudish. For new apps, call providers directly with your own keys stored in Cloudish secrets.
