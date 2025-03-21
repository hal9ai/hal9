---
sidebar_position: 3
---

# Using LLMs

This section presents how to build our first LLM chatbots using LLMs like OpenAI and Groq.

## OpenAI

OpenAI's API is quite popular given that all the computation is happening in the cloud, no need to find our own GPUs, and they are one of the leading LLMs in terms of quality.

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

Hal9 Platform provides API tokens for all major AI models. Therefore, the best practice is to let Hal9 manage the API keys for you. To use Hal9's tokens, you will have to use Hal9 Proxy, as follows:

```python
import os
client = OpenAI(base_url="https://api.hal9.com/proxy/server=https://api.openai.com/v1/", api_key = os.environ['HAL9_TOKEN'])
```

Notice that we are changing the `base_url` parameter to redirect the request through Hal9 Proxy and we are using your `HAL9_TOKEN` (see [deployment](deployment.md)) as the token to the AI model. This code also works perfectly fine locally as long as you sign up for Hal9 and retrieve your token from [hal9.com/devs](https://hal9.com/devs).

Alternatevely, you could also use your own API key directly in your code; this is fine as long as you don't make your application public.

```python
client = OpenAI(api_key = "YOUR_API_KEY")
```

Subsequent section will use Hal9 Proxy, but you can remove the proxy and hardcode your own API key at any time.

## Groq

You can also make use of any other LLM and even open source LLMs. The following example makes use of Groq and Meta's Llama LLM. One advantage of using Groq over OpenAI is that their system is optimized for speed, so expect this code to run much faster:

```python deploy
import hal9 as h9
from groq import Groq
import os

messages = h9.load("messages", [{ "role": "system", "content": "Reply in Spanish" }])
messages.append({"role": "user", "content": input()})

client = Groq(base_url="https://api.hal9.com/proxy/server=https://api.groq.com", api_key=os.environ['HAL9_TOKEN'])

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