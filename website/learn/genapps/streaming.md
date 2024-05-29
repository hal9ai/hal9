
# Streaming

## Text

To stream text from APIs, simply  print text incrementally:

```python
import os
from openai import OpenAI

stream = OpenAI().chat.completions.create(
  model = "gpt-4",
  messages = [
    {"role": "system", "content": "Reply in Spanish"},
    {"role": "user", "content": input("")},
  ],
  stream = True,
 )

for chunk in stream:
  if len(chunk.choices) > 0 and chunk.choices[0].delta.content is not None: 
    print(chunk.choices[0].delta.content, end="")
```