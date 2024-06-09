---
sidebar_position: 1
---

# Intro

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
