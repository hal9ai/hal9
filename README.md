# [Hal9](https://hal9.com): Build AI Apps in Python

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Hal9 PyPi Downloads](https://img.shields.io/pypi/dm/hal9?label=PyPI)](https://pypistats.org/packages/hal9)
[![GitHub star chart](https://img.shields.io/github/stars/hal9ai/hal9?style=flat-square)](https://star-history.com/#hal9ai/hal9)

> **Hal9 Platform is now Cloudish.** Hal9 Platform has evolved into [Cloudish](https://cloudish.ai), the cloud AI agents sign up for and deploy to on their own. The `hal9` Python package remains supported: keep writing your app in Python with `input()` and `print()` (or the `hal9` helpers), then ask an AI coding agent such as Claude Code, Codex, or Cursor to build a chat interface and deploy it to Cloudish.

[Hal9](https://hal9.com) is a Seattle AI company. It builds [Cloudish](https://cloudish.ai), a cloud where AI agents create their own API key, submit a Dockerfile or container image, and get a live HTTPS URL, with no local Docker and no signup form. This repository contains the open-source `hal9` Python package, its JavaScript counterpart, and example apps.

The `hal9` Python package is purpose-built for generative AI, enabling you to create and deploy generative ([LLMs](https://github.com/Hannibal046/Awesome-LLM) and [diffusers](https://github.com/huggingface/diffusers)) applications (chatbots, agents, APIs, and apps). Key features:
- **Flexible:** Use any library ([LangChain](https://python.langchain.com/v0.1/docs/get_started/quickstart/), [DSPy](https://dspy-docs.vercel.app/docs/quick-start/installation)), and any model ([OpenAI](https://platform.openai.com/docs/api-reference/introduction), [Llama](https://ai.meta.com/blog/5-steps-to-getting-started-with-llama-2/), [Groq](https://docs.api.groq.com/md/tutorials/python.groqapi.html), [MidJourney](https://docs.imagineapi.dev/en)).
- **Intuitive:** No need to learn app frameworks ([Flask](https://flask.palletsprojects.com/en/3.0.x/quickstart/)), simply use `input()` and `print()`, or write files to disk.
- **Scalable:** Your AI can be packaged as a container and deployed to [Cloudish](https://cloudish.ai) or any other container platform.
- **Powerful:** Support for long-running agents, multiple programming languages, complex system dependencies, and running arbitrary code in secure containers.
- **Open:** The code behind Hal9 is open source and open for contributions under [apps/hal9](https://github.com/hal9ai/hal9/tree/main/apps/hal9).

Focus on AI (RAG, fine-tuning, alignment, training) and let your coding agent handle the frontend, backend integration, deployment, and operations.

## Getting Started

Create and run a chatbot locally in seconds:

```bash
pip install hal9

hal9 create chatbot
hal9 run chatbot
```

The code inside `chatbot/app.py` contains a "Hello World" chatbot that reads the user prompt and echoes the result back:

```python
prompt = input()
print(f"Echo: {prompt}")
```

We designed this package with simplicity in mind: the job of the code is to read input and write output, that's about it. That said, you can create chatbots that use LLMs, generate images, use tools that connect to databases, or even build websites and games.

## Creation

By default `hal9 create` uses the `--template echo` template, but you can choose different ones as follows:

```bash
hal9 create chatbot-openai --template openai
hal9 create chatbot-groq --template groq
```

A template provides ready-to-use code for specific technologies and use cases. It is very popular to use OpenAI's ChatGPT-like template with `--template openai`; the generated code looks as follows:

```python
import hal9 as h9
from openai import OpenAI

messages = h9.load("messages", [])
prompt = h9.input(messages = messages)

completions = OpenAI().chat.completions.create(model = "gpt-4", messages = messages, stream = True)

h9.complete(completions, messages = messages)
h9.save("messages", messages, hidden = True)
```

The [learn code](https://hal9.com/docs/learn/code) section explains in detail how this code works, but here is a quick overview. The `hal9` package contains helper functions to simplify your generative AI code. You can choose not to use `hal9` at all and use `input()` and `print()` yourself, or even use tools like `langchain`. The `h9.load()` and `h9.save()` functions load and save data across chat sessions, since your application process is stateless by default. The `h9.input()` function is a slim wrapper over `input()` that also stores the user input in `messages`. Then `h9.complete()` is a helper function to parse the completion results and save the result in `messages`. That's about it!

## Development

To make changes to your project, open `chatbot/` in your IDE and modify `chatbot/app.py`.

You can then run your project as follows:

```bash
hal9 run chatbot
```

If you customized your template with `--template`, make sure to set the correct key. For example, if you are using the OpenAI template on Linux or macOS:

```bash
export OPENAI_API_KEY=YOUR_OPENAI_KEY
```

For Windows use:

```bash
set OPENAI_API_KEY=YOUR_OPENAI_KEY
```

For more information on obtaining and using your OpenAI API key, please refer to the [OpenAI API Key documentation](https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key).

This command is just a convenience wrapper around running the code yourself with `python app.py`.

## Deployment

Hal9 Platform used to package a Python app with a chat frontend and host it on `hal9.com`. Hal9 Platform has evolved into [Cloudish](https://cloudish.ai). Cloudish runs containers, so your app needs its own web interface and a `Dockerfile`; Cloudish builds the container server-side and gives it a live HTTPS URL.

You don't have to write that interface yourself. Open your project in Claude Code, Codex, Cursor, or another coding agent and ask:

> This is a Hal9 app. `app.py` reads user messages from stdin with `input()` / `hal9.input()` and writes replies to stdout with `print()` / `hal9.complete()`. Build a chat web interface and a small server that runs `app.py` for each message and streams its output. Add a `Dockerfile` that listens on port 8080, then deploy it to cloudish.ai using https://cloudish.ai/skill.md as the deployment guide.

The agent will:

1. Build a chat frontend and a server that bridges HTTP requests to your program's stdin/stdout.
2. Add a `Dockerfile` with your dependencies and a listening port.
3. Create a Cloudish key, deploy the container, and return the HTTPS URL.

Cloudish is agent-first: the agent can create a key and deploy without a signup form, and it builds the image server-side so no local Docker is required. New keys include a small starting credit (subject to availability); usage is prepaid and metered per second. If your app stores data with `h9.save()` / `h9.load()`, ask the agent to attach a Cloudish volume and keep the `.storage` folder on it so conversations survive restarts.

See [Deployment](https://hal9.com/docs/learn/code/deployment) in the docs for more detail.

### Legacy Hal9 Platform

Hal9 Platform is read-only. It no longer accepts new deployments, so `hal9 deploy` and `h9.deploy()` cannot publish apps there. Deploy to Cloudish instead.

## Migrating from Hal9 Platform

- **Apps:** Ask your coding agent to add a chat frontend, a server, and a `Dockerfile`, then deploy the container to Cloudish. The Python logic in `app.py` stays the same.
- **Deployment:** `hal9 deploy` no longer works because the legacy platform is read-only. Cloudish uses its own API key, which your agent can create automatically.
- **Data:** Hal9 Platform provided storage for `h9.save()` / `h9.load()`. On Cloudish, attach a persistent volume and keep the `.storage` folder on it.
- **Interfaces:** Hal9 Platform provided the chat UI. With Cloudish, the interface is part of your app, which is why the agent builds it for you.

## Contributing

You can deploy your apps to [Cloudish](https://cloudish.ai), and you can collaborate with our community by contributing new examples to the [/apps](https://github.com/hal9ai/hal9/tree/main/apps/hal9) directory in this repository.

The `hal9` Python package is located in the [/python](https://github.com/hal9ai/hal9/tree/main/python) directory, while the documentation website resides under [/website](https://github.com/hal9ai/hal9/tree/main/website). We encourage contributors to focus on enhancing apps first before proposing more complex changes.

Keep in mind that the philosophy of the `hal9` package is to remain a lightweight wrapper around `input()` and `print()`. The Python community already offers many excellent frameworks, and we aim to encourage their use rather than creating another one.
