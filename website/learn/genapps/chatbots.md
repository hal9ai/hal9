---
sidebar_position: 1
---

# Chatbots

Learn how to create a "Hello World" chatbot using Python and a [LLM](../genai/llm.md) powered chatbot. 

:::tip
Deploy your chatbot code to the cloud in one click using the button available on each code block.
:::

## Echo

ChatGPT populatized the chat interface as the application interface to interoperate with LLMs, tools like MidJourney have also popularized through their use of Disscord.

From an applicaiton development perspective, the simplest chat interface we can build relies on input / output functions provided by the language itself.

For example, the following Python code generates a chatbot that replies "Echo" to whatever the input is:

```python
echo = input()
print(f"Echo: {echo}")
```

Arguably that's the simplest chatbot we can create, but is lacking to use any generative AI technology.

## OpenAI

OpenAI's API is quite popular and fast to run given that all the compute is happening in cloud GPUs.

```bash
OPENAI_API_KEY=YOURAPIKEY python
```

Followed by running the following code:

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
