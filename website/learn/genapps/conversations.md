
# Conversations

It is expected from a chatbot to not only reply once, but rather keep an open ended conversation with the user.

We can accomplish this with something like:

```python
while(True):
  echo = input()
  print(f"Echo: {echo}")
```

However, for various LLMs we will need to pass the conversation history. As a first approach.

## Memory

The easiest way to manage a conversation is to store it in memory. Using OpenAI, we can create a conversational chatbot as follows:

```python
from openai import OpenAI

messages = [
  {"role": "system", "content": "Reply in Spanish"}
];

while(True):
  messages.append({"role": "user", "content": input("")})
  completion = OpenAI().chat.completions.create(model = "gpt-4", messages = messages)
  print(completion.choices[0].message.content)
```

## Disk

However, you might want to caome back later to chat in which case, exiting Python will loose the history. We can fix this by storing and loading history as a file:

```python
import json
from openai import OpenAI

messages_path = Path("messages.json")
if messages_path.exists():
  messages = json.loads(file_path.read_text())
else:
  messages = [{ "role": "system", "content": "Reply in Spanish" }];

while(True):
  messages.append({"role": "user", "content": input("")})
  completion = OpenAI().chat.completions.create(model = "gpt-4", messages = messages)
  print(completion.choices[0].message.content)

  messages_path.write_text(json.dumps(messages, indent=4))
```