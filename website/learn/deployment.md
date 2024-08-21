---
sidebar_position: 80
---

# Deploying Chatbots

To explicitly deploy a chatbot to Hal9 one can use the Hal9 Command Line Interface (**CLI**) as follows:

```bash
pip install hal9

hal9 create chatbot
hal9 deploy chatbot
```

Beside chatbots, Hal9 can also deploy and run other content types like images, static websites, Streamlit data apps, web APIs, or you can even send a pull request to [Hal9's GitHub](https://github.com/hal9ai/hal9) project to extend this to any other content type.

## Data Apps

Web Applications (Web Apps) are applications that provide endpoints for us to use with a web browser (Chrome, Safari, Firefox, etc).

```python
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

```python
from fastapi import FastAPI
import random

app = FastAPI()

@app.get("/")
async def roll():
    return f"You rolled a {random.randint(1, 6)}!"
```

When a chatbot generates an API, Hal9 automatically deploys and embeds the API endpoint; however, if you have to manually deploy an API you can accomplish this as follows:

```bash
pip install hal9

hal9 create webapi --type flask
hal9 deploy webapi --type flask
```
