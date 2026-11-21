---
sidebar_position: 3
---

# Using LLMs

This section presents how to build our first LLM chatbots using LLMs like OpenAI and Groq.

## OpenAI

OpenAI's API is quite popular given that all the computation is happening in the cloud, no need to find our own GPUs, and they are one of the leading LLMs in terms of quality.

To build this OpenAI based chatbot first define your API key:

```bash
export OPENAI_API_KEY=YOURAPIKEY
python
```

Followed by the following code:

```python
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

However, the previous code will forget messages and take too long to display an answer. We can improve this using the memory and streaming concepts from the [building AIs](create.md) section:

```python
import hal9 as h9
from openai import OpenAI

messages = h9.load("messages", [{ "role": "system", "content": "Reply in Spanish" }])
messages.append({"role": "user", "content": input()})

stream = OpenAI().chat.completions.create(
  model = "gpt-4",
  messages = messages,
  stream = True
)

content = ""
for chunk in stream:
  if len(chunk.choices) > 0 and chunk.choices[0].delta.content is not None: 
    print(chunk.choices[0].delta.content, end="")
    content += chunk.choices[0].delta.content

messages.append({"role": "assistant", "content": content})
h9.save("messages", messages, hidden = True)
```

### API Keys

Bring your own API key. Locally, set it as an environment variable. In production, add it as a [Cloudish secret](deployment.md) so it is injected into the container at runtime and never committed to the repository.

The OpenAI client reads `OPENAI_API_KEY` automatically. For other clients, pass the key explicitly:

```python
import os
from openai import OpenAI

client = OpenAI(api_key = os.environ["OPENAI_API_KEY"])
```

Never hardcode a key in code that you make public. The legacy Hal9 Platform provided a proxy that managed provider keys with a `HAL9_TOKEN`; the legacy platform is read-only while it transitions to Cloudish. New apps should use provider API keys and Cloudish secrets.

## Groq

You can also make use of any other LLM and even open source LLMs. The following example makes use of Groq and Meta's Llama LLM. One advantage of using Groq over OpenAI is that their system is optimized for speed, so expect this code to run much faster:

```python
import hal9 as h9
from groq import Groq
import os

messages = h9.load("messages", [{ "role": "system", "content": "Reply in Spanish" }])
messages.append({"role": "user", "content": input()})

client = Groq(api_key = os.environ["GROQ_API_KEY"])

stream = client.chat.completions.create(
  model="llama3-70b-8192",
  messages=messages,
  stream=True
)

content = ""
for chunk in stream:
  if len(chunk.choices) > 0 and chunk.choices[0].delta.content is not None: 
    print(chunk.choices[0].delta.content, end="")
    content += chunk.choices[0].delta.content

messages.append({"role": "assistant", "content": content})
h9.save("messages", messages, hidden = True)
```

Set your key before running:

```bash
export GROQ_API_KEY=YOUR_GROQ_KEY
```
