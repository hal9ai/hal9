---
sidebar_position: 80
---

# Deployment

:::info Hal9 Platform is transitioning to Cloudish
Hal9 Platform is moving to [Cloudish](https://cloudish.ai). You can deploy Python apps to Cloudish today; the legacy platform is read-only while the transition continues and no longer accepts deployments. The `hal9` Python package still runs your app; what changes is how the app is packaged and hosted. Deploy new apps to Cloudish.
:::

Cloudish is an agent-first cloud: an AI agent can create its own API key, submit a Dockerfile or container image, and get a live HTTPS URL. It builds images server-side, so there is no local Docker and no signup form. Usage is prepaid and metered per second.

## Chatbots

The `hal9` package treats a program's stdin/stdout as the application contract. The legacy Hal9 Platform supplied a chat interface around that contract. Cloudish runs containers, so it does not add an interface for you. A chatbot needs three things:

1. A chat frontend (HTML/JavaScript or a web framework).
2. A small server that runs your Python program for each message and streams its output.
3. A `Dockerfile` that installs your dependencies and listens on a port.

You do not have to write these yourself. The recommended workflow is to ask an AI coding agent to build them.

### Deploy with an AI coding agent

Open your project in Claude Code, Codex, Cursor, or another coding agent and ask:

> This is a Hal9 Python app. `app.py` reads a user message from stdin with `input()` / `hal9.input()` and writes the reply to stdout with `print()` / `hal9.complete()`. Build a chat web interface and a server that runs `app.py` for each message and streams its output to the browser. Add a `Dockerfile` that installs the dependencies and listens on port 8080. If the app uses `h9.save()` / `h9.load()`, attach a Cloudish volume and keep the `.storage` folder on it so conversations survive restarts. Deploy the app to cloudish.ai using https://cloudish.ai/skill.md as the deployment guide, then give me the live URL.

The agent will build the frontend and server, package the app, create a Cloudish key, deploy the container, and return the URL. It also returns a claim link: open it to attach the key to a Cloudish account, see the dashboard, and add credits. If you already have a Cloudish key, give it to the agent so it reuses that key instead of creating a new one.

### Choosing how the app runs

Cloudish can run an app around the clock or put it to sleep when idle:

- `alwaysOn: true` for sites and APIs that must answer immediately, and for bots or workers that nothing sends requests to.
- `sleepAfterMinutes: 30` (the default is 15) to bill only while the app is awake; the next request wakes it in seconds.

Tell your agent which behavior you want. For a chatbot used occasionally, sleeping is usually a good default.

### Persistent data

The `h9.save()` and `h9.load()` helpers store data under `.storage` in the working directory. Containers are ephemeral, so if the conversation must survive restarts, ask your agent to attach a Cloudish volume and either run the app with the volume as its working directory or point `.storage` at the volume. SQLite on the volume is also a good option for larger data.

### Manual deployment

If you prefer to deploy without an agent, create a `Dockerfile` at the root of the project and send the build context to Cloudish. The full API is documented at [cloudish.ai/skill.md](https://cloudish.ai/skill.md).

```bash
# 1. Get a key (returns {"key": "cld_...", "claimUrl": "...", "apiKey": {"alias": "..."}}).
curl -sS -X POST https://cloudish.ai/api/v1/keys \
  -H "content-type: application/json" \
  -d '{"alias": "my-chatbot", "agent": "claude-code"}'
export CLOUDISH_API_KEY="cld_..."

# 2. Upload the build context. Exclude files that contain secrets.
tar --exclude='.env*' --exclude='.git' -czf context.tar.gz .
curl -sS -X POST https://cloudish.ai/api/v1/projects \
  -H "Authorization: Bearer $CLOUDISH_API_KEY" \
  -F "name=my-chatbot" -F "port=8080" -F "context=@context.tar.gz"

# 3. Poll the build until it succeeds.
curl -sS https://cloudish.ai/api/v1/images/builds/BUILD_ID \
  -H "Authorization: Bearer $CLOUDISH_API_KEY"
```

Once the build succeeds, fetch the project to get its `subdomain.url`:

```bash
curl -sS https://cloudish.ai/api/v1/projects/YOUR_ALIAS/my-chatbot \
  -H "Authorization: Bearer $CLOUDISH_API_KEY"
```

API keys and tokens belong in Cloudish secrets, not in the image or the build context:

```bash
curl -sS -X PUT https://cloudish.ai/api/v1/projects/YOUR_ALIAS/my-chatbot/secrets \
  -H "Authorization: Bearer $CLOUDISH_API_KEY" \
  -H "content-type: application/json" \
  -d '{"name": "OPENAI_API_KEY", "value": "sk-..."}'
```

## Data Apps

Web applications provide endpoints for a browser (Chrome, Safari, Firefox, etc.). Streamlit is a common choice for data apps:

```python
import streamlit as st
import random

if st.button("Roll a dice"):
  st.write(f"You rolled a {random.randint(1, 6)}!")
```

Run it locally with:

```bash
pip install streamlit
streamlit run app.py
```

To host it on Cloudish, package it as a container that listens on port 8080:

```bash
streamlit run app.py --server.address 0.0.0.0 --server.port 8080
```

Ask your agent to add a `Dockerfile` with that command and deploy it with `port=8080`. Streamlit apps generally work better on an always-on or larger instance because they hold state in memory.

## Web APIs

Web APIs are applications designed for other programs to use. You can build them with FastAPI or Flask, and Cloudish can run either one.

Always keep a root endpoint (`@app.get("/")` or `@app.route("/")`) so callers and platform health checks can verify the app is running.

### FastAPI

```python
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

Run it locally with:

```bash
pip install fastapi uvicorn
uvicorn app:app --host 0.0.0.0 --port 8080
```

### Flask

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

Run it locally with:

```bash
pip install flask
flask --app app run --host 0.0.0.0 --port 8080
```

Package the API with a `Dockerfile` and deploy it to Cloudish with `port=8080`. Put provider keys in Cloudish secrets and read them from the environment in your code:

```python
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
```

See [AI-Powered Backend Applications](webapis.md) for a complete example.

:::note
The legacy Hal9 Platform is read-only while it transitions to Cloudish and no longer accepts deployments. `hal9 deploy` and `h9.deploy()` cannot publish apps there; use Cloudish for all new deployments.
:::
