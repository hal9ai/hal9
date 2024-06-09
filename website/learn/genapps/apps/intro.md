---
sidebar_position: 1
---

# Intro

An [application](https://en.wikipedia.org/wiki/Application_software) is a computer program designed to carry out a specific task. This section will present a few different types of applications we can build: chatbots, web applications, and web APIs.

## Chatbots

ChatGPT populatized the chat interface as the application interface to interoperate with [LLMs](../../genai/llm), tools like MidJourney have also popularized through their use of Disscord.

From an applicaiton development perspective, the simplest chat interface we can build relies on input / output functions provided by the language itself.

For example, the following Python code generates a chatbot that replies "Echo" to whatever the input is:

```python
echo = input()
print(f"Echo: {echo}")
```

Arguably that's the simplest chatbot we can create, we will add use of generative AI technology in subsequent sections.

## Web Apps

Web Applications (Web Apps) are applications that provide endpoints for us to use with a web browser (Chrome, Safari, Firefox, etc).

```python
import streamlit as st
import random

if st.button("Roll a dice"):
  st.write(f"You rolled a {random.randint(1, 6)}!")
```

## Web APIs

Web APIs are applications that are designed for other computer programs or services to interoperate with, if you wanted to enable other web apps to use your previous app, you would do this as follows:

```python
from flask import Flask
import random

app = Flask(__name__)

@app.route('/')
def roll():
    return f"You rolled a {random.randint(1, 6)}!"
```
