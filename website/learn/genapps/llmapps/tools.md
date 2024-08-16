# Tools

This section presents how to add tools to your LLM application.

```python
import hal9 as h9
from openai import OpenAI

def multiply(a: int, b: int) -> int:
    """Multiply two numbers."""
    return a * b

messages = h9.load("messages", [])
prompt = h9.input(messages = messages)

completion = OpenAI().chat.completions.create(
  model = "gpt-4",
  messages = messages,
  functions = h9.describe([ multiply ]),
  function_call = "auto",
  stream = True
)

h9.complete(completion, messages = messages, functions = [ multiply ])
h9.save("messages", messages, hidden = True)
```
