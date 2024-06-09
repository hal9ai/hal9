
# Chatbots

This section will present techniques required to add functionality to chatbots related to remembering conversations and streaming responses which are important topics to interface with [LLMs](../../genai/llm)

## Conversations

It is expected from a chatbot to not only reply once to a message, but rather keep an open ended conversation with the user.

We can think of two main strategies to accomplish this. The first one is to run an infinite amount of question-answer cycles through the use of an infinite loop as follows:

```python
while(True):
  echo = input("What's your name? ")
  print(f"Hello, {echo}!")
```

The other approach is to run the Python program continuously; however, in both cases we usually need to remember all the previous messages (the **conversation**) that took place to provide more accurate answers for our chatbot.

There are two main strategies we can use to remember the conversation: we can store this in **memory** or store it in our computer **storage**.

### Memory

The easiest way to manage a conversation is to store it in memory. Using OpenAI, we can create a conversational chatbot as follows:

```python
from openai import OpenAI

messages = [
  {"role": "system", "content": "Spanish replies"}
];

while(True):
  messages.append({"role": "user", "content": input()})
  completion = OpenAI().chat.completions.create(model = "gpt-4", messages = messages)
  print(completion.choices[0].message.content)
```

This method is easy to implement since it only requires adding the infinite loop, but is not suited for intermittent use since the code might restart and the conversation lost.

We often reffer to the memory we need to remember as the programs **state**, and a computer program that needs to remember state referred to as **stateful**.

### Storage

To use computing resources efficiently and reliably, we can store the conversation on your computer storage. Therefore, even if Python restarts or you come back later to interact with your chatbot after a comptuer restart, your chatbot will behave correctly remembering the conversation.

To make your chatbot behave correctly even after Python restarts, we can store the conversation messages to files. You can use any Python library to store and load files, but we recommend the `hal9` package convenience functions to `save` and `load` files with ease:

```python
from openai import OpenAI
import hal9 as h9

messages = h9.load("messages", [{ "role": "system", "content": "Spanish replies" }])

messages.append({"role": "user", "content": input()})
completion = OpenAI().chat.completions.create(model = "gpt-4", messages = messages)
print(completion.choices[0].message.content)

h9.save("messages", messages)
```

In contrast to stateless, a computer program that does not need to remember its state on its own, is referred to as **stateles**. The system as a whole, chatbot and file, is indeed stateful; however, giving someone else the job of remembering state (in this case the file) makes programs more reliable, efficient, and is a concept we will use through this guide.

## Streaming

To stream text from APIs, simply  print text incrementally:

```python
import os
from openai import OpenAI

stream = OpenAI().chat.completions.create(
  model = "gpt-4",
  messages = [
    {"role": "system", "content": "Reply in Spanish"},
    {"role": "user", "content": input()},
  ],
  stream = True,
 )

for chunk in stream:
  if len(chunk.choices) > 0 and chunk.choices[0].delta.content is not None: 
    print(chunk.choices[0].delta.content, end="")
```
