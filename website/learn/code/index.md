# Developers

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Hal9 PyPi Downloads](https://img.shields.io/pypi/dm/hal9?label=PyPI)](https://pypistats.org/packages/hal9)
[![GitHub star chart](https://img.shields.io/github/stars/hal9ai/hal9?style=flat-square)](https://star-history.com/#hal9ai/hal9)

:::info Hal9 Platform is transitioning to Cloudish
Hal9 Platform is moving to [Cloudish](https://cloudish.ai), the cloud AI agents sign up for and deploy to on their own. You can deploy Python apps to Cloudish today; the legacy platform is read-only while the transition continues. The `hal9` Python package remains supported. Write your app in Python, then ask an AI coding agent such as Claude Code, Codex, or Cursor to build a chat interface and deploy it to Cloudish. See [Deployment](deployment.md).
:::

[Hal9](https://hal9.com) is a Seattle AI company. It builds [Cloudish](https://cloudish.ai), a cloud where AI agents create their own API key, submit a Dockerfile or container image, and get a live HTTPS URL, with no local Docker and no signup form.

The `hal9` Python package is purpose-built for generative AI, enabling you to create generative ([LLMs](https://github.com/Hannibal046/Awesome-LLM) and [diffusers](https://github.com/huggingface/diffusers)) applications (chatbots, agents, APIs, and apps). Key features:
- **Flexible:** Use any library ([LangChain](https://python.langchain.com/v0.1/docs/get_started/quickstart/), [DSPy](https://dspy-docs.vercel.app/docs/quick-start/installation)), and any model ([OpenAI](https://platform.openai.com/docs/api-reference/introduction), [Llama](https://ai.meta.com/blog/5-steps-to-getting-started-with-llama-2/), [Groq](https://docs.api.groq.com/md/tutorials/python.groqapi.html), [MidJourney](https://docs.imagineapi.dev/en)).
- **Intuitive:** No need to learn app frameworks ([Flask](https://flask.palletsprojects.com/en/3.0.x/quickstart/)), simply use `input()` and `print()`, or write files to disk.
- **Scalable:** Package your app as a container and deploy it to [Cloudish](https://cloudish.ai) or any other container platform.
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

The rest of this section explains in detail how this code works, but here is a quick overview. The `hal9` package contains helper functions to simplify your generative AI code. You can choose not to use `hal9` at all and use `input()` and `print()` yourself, or even use tools like `langchain`. The `h9.load()` and `h9.save()` functions load and save data across chat sessions, since your application process is stateless by default. The `h9.input()` function is a slim wrapper over `input()` that also stores the user input in `messages`. Then `h9.complete()` is a helper function to parse the completion results and save the result in `messages`. That's about it!

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

`hal9 run` is just a convenience wrapper around running the code yourself with `python app.py`.

## Deployment

Hal9 Platform used to package a Python app with a chat frontend and host it on `hal9.com`. It is transitioning to [Cloudish](https://cloudish.ai), and the legacy platform is read-only while that transition continues, so it no longer accepts deployments. Cloudish runs containers, so your app needs its own web interface and a `Dockerfile`; Cloudish builds the container server-side and gives it a live HTTPS URL.

The recommended workflow is to open your project in an AI coding agent and let it build the interface and deploy the container. See the [Deployment](deployment.md) section for the prompt to give your agent, a manual deployment walkthrough, and notes on persistent storage.

## Contributing

You can deploy your apps to [Cloudish](https://cloudish.ai), and you can collaborate with our community by contributing new examples to the [/apps](https://github.com/hal9ai/hal9/tree/main/apps/hal9) directory in this repository.

The `hal9` Python package is located in the [/python](https://github.com/hal9ai/hal9/tree/main/python) directory, while the documentation website resides under [/website](https://github.com/hal9ai/hal9/tree/main/website). We encourage contributors to focus on enhancing apps first before proposing more complex changes.

Keep in mind that the philosophy of the `hal9` package is to remain a lightweight wrapper around `input()` and `print()`. The Python community already offers many excellent frameworks, and we aim to encourage their use rather than creating another one.
