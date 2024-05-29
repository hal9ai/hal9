---
sidebar_position: 1
---

# Chatbots

## Echo

ChatGPT populatized the chat interface as the application interface to interoperate with LLMs, tools like MidJourney have also popularized through their use of Disscord.

From an applicaiton development perspective, the simplest chat interface we can build relies on input / output functions provided by the language itself.

For example, the following Python code generates a chatbot that replies "Echo" to whatever the input is:

```python
echo = input()
print(f"Echo: {echo}")
```

Arguably that's the simplest chatbot we can create, but is lacking to use any generative AI technology.

## Tiny Llama

To fix that, we can change the chatbot to use a small **Open Source Software** (**OSS**) LLM called Tiny Llama created by Andrej Karpathy with a [Python wrapper](https://github.com/karpathy/llama2.c) that we can easily run.

First we need to download the tokenizer and 15Mb stories weights:

```bash
pip install llama2-py==0.0.6
wget https://huggingface.co/karpathy/tinyllamas/resolve/main/stories15M.bin
wget https://github.com/tairov/llama2.py/raw/master/tokenizer.bin
```

Followed by building our chatbot as follows:

```python
import llama2_py

prompt = input()
llama2_py.run({ "checkpoint": "stories15M.bin", "temperature": 0.0, "steps": 256, "prompt": prompt })
```

Notice that `llama2_py.run` will print the output so no need to call `print()` explicitly.

However, running this small LLM will take a long time since the project itself does not use GPUs. Therefore, the code above is not that useful beyond learning examples.

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
    {"role": "user", "content": input("")},
  ]
 )

print(completion.choices[0].message.content)
```
