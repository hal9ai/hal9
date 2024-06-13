---
sidebar_position: 1
---

# Intro

This section presents how to build our first LLM application using OpenAI and a chatbot interface.

## OpenAI

OpenAI's API is quite popular given that all the compute is happening in the cloud, no need to find our own GPUs, and they are one of the leading LLMs in terms of quality.

To build this OpenAI based chatbot first define your API key:

```bash
OPENAI_API_KEY=YOURAPIKEY python
```

Followed by the following code:

```python
import os
from openai import OpenAI

completion = OpenAI().chat.completions.create(
  model = "gpt-4",
  messages = [
    {"role": "system", "content": "Reply in Spanish"},
    {"role": "user", "content": input()},
  ]
 )

print(completion.choices[0].message.content)
```

However, the previous code will forget messages and take too long to display an answer. We can improve this using the memory and streaming concepts from the [chatbots](../apps/chatbots.md) section:

```python
import hal9 as h9
from openai import OpenAI

messages = h9.load("messages", [{ "role": "system", "content": "Reply in Spanish" }])
messages.append({"role": "user", "content": input()})

completion = OpenAI().chat.completions.create(
  model = "gpt-4",
  messages = messages,
  stream = True
)

for chunk in stream:
  if len(chunk.choices) > 0 and chunk.choices[0].delta.content is not None: 
    print(chunk.choices[0].delta.content, end="")

messages.append({"role": "ai", "content": completion.choices[0].message.content})
h9.save("messages", messages, hidden = True)
```

## Groq

You can also make use of any other LLM and even open source LLMs. The following example makes use of Groq and Meta's Llama LLM. One advantage of using Groq over OpenAI is that their system is optimized for speed, so expect this code to run much faster:

```python
import hal9 as h9
from groq import Groq

messages = h9.load("messages", [{ "role": "system", "content": "Reply in Spanish" }])
messages.append({"role": "user", "content": input()})

completion = Groq().chat.completions.create(
  model="llama3-70b-8192",
  messages=messages,
  stream=True
)

for chunk in completion:
  print(chunk.choices[0].delta.content or "", end="")

messages.append({"role": "ai", "content": completion.choices[0].message.content})
h9.save("messages", messages, hidden = True)
```