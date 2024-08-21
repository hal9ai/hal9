---
sidebar_position: 1
---

# Chatbots

ChatGPT populatized the chat interface as the application interface to interoperate with [LLMs](../../genai/llm), tools like MidJourney have also popularized through their use of Disscord.

From an applicaiton development perspective, the simplest chat interface we can build relies on input / output functions provided by the language itself.

For example, the following Python code generates a chatbot that replies "Echo" to whatever the input is. Arguably this is the simplest chatbot we can create.

```python
echo = input()
print(f"Echo: {echo}")
```

You can deploy this to Hal9 using the rocket icon in the code or by running:

```
pip install hal9

hal9 create echo-chatbot
HAL9_TOKEN=H9YOURTOKEN hal9 deploy echo-chatbot
```

Notice that `deploy` needs a `HAL9_TOKEN` environment variable with an API token you can get from [hal9.com/devs](https://hal9.com/devs). You can use this token to deploy from your local computer, a notebook or automate from GitHub.

## Memory

It is expected from a chatbot to, not only reply to a message, but to also remember previous messages from the conversation.

We can think of two main strategies to accomplish this. The first one (**stateful**) is to run our program "forever" and remember the conversation ourselves. The second one (**stateless**), is to store the conversation into a file that we can recover it even if our program restarts.

### Stateful

The first strategy to remember a conversation is to keep your program running to process multiple messages. We accomplish this by running an infinite loop of question-answer cycles through as follows:

```python
all_words = []
while(True):
  word = input("Give me a word: ")
  all_words.append(word)
  print(f"I remember: {', '.join(all_words)}")
```

This method is easy to implement, but it will loose conversation context over time after your program restarts; therefore, you will likely want to avoid this approach.

We reffer to the memory we need to remember as the programs **state**, and a computer program that needs to remember state referred to as **stateful**.

### Stateless

To use computing resources efficiently and reliably, we can store the conversation on your computer storage as a file. Even if your program restarts, your chatbot will behave correctly and not forget the conversation.

To make your chatbot behave correctly even after it restarts, we can store the conversation messages to files. You can use any library to store and load files, but we recommend the `hal9` package convenience functions to `save` and `load` files with ease:

```python
from openai import OpenAI
import hal9 as h9

all_words = h9.load("words", [])

word = input("Give me a word: ")
all_words.append(word)
print(f"I remember: {', '.join(all_words)}")

h9.save("words", messages, hidden = True)
```

In contrast to stateless, a computer program that does not need to remember its state on its own, is referred to as **stateles**. The system as a whole, chatbot and file, is indeed stateful; however, giving someone else the job of remembering state (in this case the file) makes programs more reliable, efficient, and is a concept we will use through this guide.

## Streaming

For complex chatbots, generating text can take a few seconds or maybe even minutes. Users might not really understand what is going on, if our programs don't do anything for several seconds; therefore, it is a good practice to communicate to the user what is happening or generate the response incrementally. That way, users can start reading a few words as soon as they become available.

The incremental process of generating text for the user is reffered to as **streaming**. We can accomplish this by printing the results incrementally calling `print` with a partial answer:

```python
import time

for i in range(1, 11):
  print(i)
  time.sleep(1)
```

Streaming will prove useful to build generative chatbots that use LLMs.

## URLs

Hal9 encourages uploads and links to be processed as URLs. For example, user can reference or upload a PDF as 'https://www.clickdimensions.com/links/TestPDFfile.pdf' which can be read from `input`.

To help assist with processing references, Hal9 provides an `input` function which extracts the text contents of a URL directly as text to easily support managing uploads.

```python
import hal9 as h9

contents = h9.input('Enter a URL: ')
print(f"Contents: {contents}")
```