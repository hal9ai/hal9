---
sidebar_position: 2
---

# Building AIs

ChatGPT popularized the chat interface as the application interface to interoperate with [LLMs](../genai/llm), tools like MidJourney have also popularized through their use of Discord.

From an application development perspective, the simplest chat interface we can build relies on input / output functions provided by the language itself. The `hal9` package uses exactly that contract: your code reads a message with `input()` (or `h9.input()`) and writes a reply with `print()` (or `h9.complete()`).

For example, the following Python code generates a chatbot that replies "Echo" to whatever the input is. Arguably this is the simplest chatbot we can create.

```python
echo = input()
print(f"Echo: {echo}")
```

You can run it locally with:

```bash
pip install hal9

hal9 create echo-chatbot
hal9 run echo-chatbot
```

`hal9 run` simply runs the Python file and connects it to your terminal. To put the chatbot online, an interface and a container are needed; see [Deployment](deployment.md) for the recommended workflow with an AI coding agent and [Cloudish](https://cloudish.ai).

## Memory

It is expected from a chatbot to, not only reply to a message, but to also remember previous messages from the conversation.

We can think of two main strategies to accomplish this. The first one (**stateful**) is to make the program remember the state in its own memory. The second one (**stateless**), is to store the conversation outside your program (in a file) so that we can recover it even if our program restarts.

The stateful method is easy to implement by storing data in-memory, but it will lose conversation context over time after your program restarts; therefore, you will likely want to avoid this approach.

To make your chatbot behave correctly even after it restarts, we can store the conversation messages to files. You can use any library to store and load files, but we recommend the `hal9` package convenience functions to `save` and `load` files with ease:

```python
import hal9 as h9

all_words = h9.load("words", [])

word = input("Give me a word: ")
all_words.append(word)
print(f"I remember: {', '.join(all_words)}")

h9.save("words", all_words, hidden = True)
```

These functions store data under the `.storage` folder in your working directory. When you deploy to Cloudish, ask your agent to attach a persistent volume and keep `.storage` on it, so the conversation survives container restarts.

In contrast to stateless, a computer program that does not need to remember its state on its own, is referred to as **stateless**. The system as a whole, chatbot and file, is indeed stateful; however, giving someone else the job of remembering state (in this case the file) makes programs more reliable, efficient, and is a concept we will use through this guide.

## Streaming

For complex chatbots, generating text can take a few seconds or maybe even minutes. Users might not really understand what is going on, if our programs don't do anything for several seconds; therefore, it is a good practice to communicate to the user what is happening or generate the response incrementally. That way, users can start reading a few words as soon as they become available.

The incremental process of generating text for the user is referred to as **streaming**. We can accomplish this by printing the results incrementally calling `print` with a partial answer:

```python
import time

for i in range(1, 11):
  print(i)
  time.sleep(1)
```

Streaming will prove useful to build generative chatbots that use LLMs. When your agent builds the web interface, ask it to stream your program's stdout to the browser so users see tokens as they arrive.

## Attachments

A common convention is to attach files in a chat as URL links. For example, users can reference or upload a PDF by typing the URL https://www.clickdimensions.com/links/TestPDFfile.pdf, which can be read from `input`.

To help process links and attachments, Hal9 provides an `input` function which can extract the text contents of a URL directly as text.

```python
import hal9 as h9

contents = h9.input('Enter a URL: ', extract = True)
print(f"Contents: {contents}")
```
