---
sidebar_position: 1
---

# Hello World

## Chatbot

ChatGPT populatized the chat interface as the application interface to interoperate with LLMs, tools like MidJourney have also popularized through their use of Disscord.

From an applicaiton development perspective, the simplest chat interface we can build relies on input / output functions provided by the language itself.

For example, the following Python code generates a chatbot that replies "Echo" to whatever the input is:

```python
echo = input()
print(f"Echo: {echo}")
```

Arguably that's the simplest chatbot we can create, but is lacking to use any generative AI technology.

## Tiny Llama

To fix that, we can change the chatbot to use a small **Open Source Software** (**OSS**) LLM called Tiny Llama created by Andrej Karpathy with a nice [Python wrapper](https://github.com/karpathy/llama2.c) that we can easily run.

```bash
pip install llama2-py==0.0.6
wget https://huggingface.co/karpathy/tinyllamas/resolve/main/stories15M.bin
wget https://github.com/tairov/llama2.py/raw/master/tokenizer.bin
```

```python
import llama2_py

prompt = input()
llama2_py.run({ "checkpoint": "stories15M.bin", "temperature": 0.0, "steps": 256, "prompt": prompt })
```

Notice that `llama2_py.run` will print the output so no need to call `print()` explicitly.
