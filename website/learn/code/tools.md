---
sidebar_position: 5
---

# Using Tools

To build complex chatbots that can support multiple operations from evaluating code expressions, calling external services, browsing the web, etc. We can enable LLMs to choose tools to use in the form of callable functions.

Hal9 simplifies the process of setting up tools with `describe()` which describes functions to be understandable by the LLM.

The following code shows how to define a `calculate` function to help LLMs execute arithmetic operations, notice that the comment in the function is used as part of the description so it's imperative 

```python
import hal9 as h9
from openai import OpenAI

def calculate(expression):
  """
  Performs arithmetic operations for numerical questions.
    'expression' is the arithmetic operations to evaluate,
      needs conversion to proper Python syntax.
  """
  return eval(expression)

messages = h9.load("messages", [])
prompt = h9.input(messages = messages)

client = OpenAI()
completion = client.chat.completions.create(
  model = "gpt-4",
  messages = messages,
  functions = h9.describe([ calculate ]),
  function_call = "auto",
  stream = True
)

h9.complete(completion, messages = messages, tools = [ calculate ])
h9.save("messages", messages, hidden = True)
```

For an advanced example of using multiple tools, consider taking a look at Hal9's main chatbot implementation in [/apps/hal9/app.py](https://github.com/hal9ai/hal9/blob/main/apps/hal9/app.py)