# [Hal9](https://hal9.com/): Create and Share Generative Apps

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Hal9 PyPi Downloads](https://img.shields.io/pypi/dm/hal9?label=PyPI)](https://pypistats.org/packages/hal9)
[![Hal9 JS Downloads](https://data.jsdelivr.com/v1/package/npm/hal9/badge)](https://www.jsdelivr.com/package/npm/hal9)
[![GitHub star chart](https://img.shields.io/github/stars/hal9ai/hal9?style=flat-square)](https://star-history.com/#hal9ai/hal9)

Create and deploy generative ([LLMs](https://github.com/Hannibal046/Awesome-LLM) and [diffusers](https://github.com/huggingface/diffusers)) applications (chatbots and APIs) in seconds.
- **Open:** Use any model ([OpenAI](https://platform.openai.com/docs/api-reference/introduction), [Llama](https://ai.meta.com/blog/5-steps-to-getting-started-with-llama-2/), [Groq](https://docs.api.groq.com/md/tutorials/python.groqapi.html), [MidJourney](https://docs.imagineapi.dev/en)) and any library like ([LangChain](https://python.langchain.com/v0.1/docs/get_started/quickstart/), [DSPy](https://dspy-docs.vercel.app/docs/quick-start/installation)).
- **Intuitive:** No need to learn app frameworks ([Flask](https://flask.palletsprojects.com/en/3.0.x/quickstart/)), simply use `input()` and `print()`, or write file to disk.
- **Scalable:** Engineers can integrate your app with scalable technologies ([Docker](https://www.docker.com/), [Kubernetes](https://kubernetes.io/), etc)
- **Powerful:** Using an OS process (stdin, stdout, files) as our app contract, enables long-running agents, multiple programming languages, and complex system dependencies.

Focus on AI (RAG, fine-tuning, alignment, training) and skip engineering tasks (frontend development, backend integration, deployment, operations).

## Getting started

Create and share a chatbot in seconds as follows:

```bash
pip install hal9

hal9 create chatbot
hal9 deploy chatbot
```

Notice that `deploy` needs a `HAL9_TOKEN` environment variable with an API token you can get from [hal9.com/devs](https://hal9.com/devs). You can use this token to deploy from your local computer, a notebook or automate from GitHub.


```bash
HAL9_TOKEN=H9YOURTOKEN hal9 deploy chatbot
```

The code inside `/chatbot/app.py` contains a "Hello World" chatbot that reads the user prompt and echos the result back:


```python
prompt = input()
print(f"Echo: {prompt}")
```

We designed this package with simplicity in mind, the job of the code is to read input and write output, that's about it. That said, you can create chatbots that use LLMs, generate images, or even use tools that connect to databases, or even build websites and games!

## Creation

By default `hal9 create` defaults to the `--template echo` template, but you can choose different ones as follows:

```bash
hal9 create chatbot-openai --template openai
hal9 create chatbot-groq --template groq
```

A template provides ready to use code with specific technologies and use cases. Is very popular to use OpenAI's ChatGPT-like template with `--template openai`, the code generated will look as follows:

```python
import hal9 as h9
from openai import OpenAI

messages = h9.load("messages", [])
prompt = h9.input(messages = messages)

completions = OpenAI().chat.completions.create(model = "gpt-4", messages = messages, stream = True)

h9.complete(completions, messages = messages)
h9.save("messages", messages, hidden = True)
```

The [Learn](https://hal9.com/docs/learn) section explain in detail how this code works, but will provide a quick overview. The `hal9` package contains a helper functions to simplify your generative AI code. You can choose to not use `hal9` at all and use `input()` and `print()` statements yourself, or even sue tools like `langchain`. The `h9.load()` and `h9.save()` functions load and save data across chat sessions, our platform is stateless by default. The `h9.input()` function is a slim wrapper over `input()` that also stores the user input in the `messages`. Then `h9.complete()` is a helper function to help parse the completion results and save the result in `messages`. That's about it!

## Development

To make changes to your project, open `chatbot/` in your IDE and modify `chatbot/app.py`.

You can then run your project as follows:

```bash
hal9 run chatbot
```

If you customized your template with `--template` make sure to set the correct key, for example `export OPENAI_KEY=YOUR_OPENAI_KEY`.

You can then run your application locally with:

```bash
hal9 run chatbot
```

This command is just a convenience wrapper to running the code yourself with something like `python app.py`.

## Deployment

The deploy command will prepare for deployment your generative app.

For example, you can prepare deployment as a generative app (Hal9). We have plans to also provide deployment to Docker and the open source community can expand this even further.

```bash
hal9 deploy chatbot --target hal9
```

Each command is tasked with preparing the deployment of your project folder. For example, `--target docker` should create a `Dockerfile` file that gets this project ready to run in cloud containers.

For personal use, `--target hal9` supports a free tier at `hal9.com`; enterprise support is also available to deploy with `--target hal9 --url hal9.yourcompany.com`
