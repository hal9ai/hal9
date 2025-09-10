# Developers

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Hal9 PyPi Downloads](https://img.shields.io/pypi/dm/hal9?label=PyPI)](https://pypistats.org/packages/hal9)
[![GitHub star chart](https://img.shields.io/github/stars/hal9ai/hal9?style=flat-square)](https://star-history.com/#hal9ai/hal9)

Hal9 is a company on a [mission](https://hal9.com/mission) to help people profit from AI, starting with startup founders. [Hal9's Startup Plan](https://hal9.com/plans) builds AI-powered MVPs for founders in 30 days, including *Hal9 Onboarding* (design, development, infrastructure, and maintenance) and *Hal9 Platform* (compute, storage, LLMs). Additionally, the Hal9 Platform offers free and developer plans, with all code designed to run on any compute infrastructure, ensuring your applications remain free from vendor lock-in.

Hal9 Platform is purpose-built for generative AI, enabling you to create and deploy generative ([LLMs](https://github.com/Hannibal046/Awesome-LLM) and [diffusers](https://github.com/huggingface/diffusers)) applications (chatbots, agents, APIs, and apps). Key features:
- **Flexible:** Use any library ([LangChain](https://python.langchain.com/v0.1/docs/get_started/quickstart/), [DSPy](https://dspy-docs.vercel.app/docs/quick-start/installation)), and any model ([OpenAI](https://platform.openai.com/docs/api-reference/introduction), [Llama](https://ai.meta.com/blog/5-steps-to-getting-started-with-llama-2/), [Groq](https://docs.api.groq.com/md/tutorials/python.groqapi.html), [MidJourney](https://docs.imagineapi.dev/en)).
- **Intuitive:** No need to learn app frameworks ([Flask](https://flask.palletsprojects.com/en/3.0.x/quickstart/)), simply use `input()` and `print()`, or write file to disk.
- **Scalable:** Designed to integrate your app with scalable technologies ([Docker](https://www.docker.com/), [Kubernetes](https://kubernetes.io/), etc).
- **Powerful:** Support for long-running agents, multiple programming languages, complex system dependencies, and running arbitrary code in a secure Kubernetes pods.
- **Open:** The code behind [hal9](https://hal9.com/apps/hal9), is also open source and open for contributions under at [apps/hal9](https://github.com/hal9ai/hal9/tree/main/apps/hal9).

Focus on AI (RAG, fine-tuning, alignment, training) and skip engineering tasks (frontend development, backend integration, deployment, operations).

## Getting Started

Create and share a chatbot in seconds as follows:

```bash
pip install hal9

hal9 create chatbot
hal9 deploy chatbot
```

Notice that `deploy` needs a `HAL9_TOKEN` environment variable with an API token you can get from [hal9.com/devs](https://hal9.com/devs). You can use this token to deploy from your local computer, a notebook or automate from GitHub.


```bash
HAL9_TOKEN=H9YOURTOKEN hal9 deploy chatbot --name my_first_chatbot
```
As easy as that you have created your first chatbot!

![alt text](image-2.png)

The code inside `/chatbot/app.py` contains a "Hello World" chatbot that reads the user prompt and echos the result back:


```python deploy
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

```python deploy
import hal9 as h9
from openai import OpenAI

messages = h9.load("messages", [])
prompt = h9.input(messages = messages)

completions = OpenAI().chat.completions.create(model = "gpt-4", messages = messages, stream = True)

h9.complete(completions, messages = messages)
h9.save("messages", messages, hidden = True)
```

The [learn code](https://hal9.com/docs/learn/code) section explains in detail how this code works, but will provide a quick overview. The `hal9` package contains a helper functions to simplify your generative AI code. You can choose to not use `hal9` at all and use `input()` and `print()` statements yourself, or even sue tools like `langchain`. The `h9.load()` and `h9.save()` functions load and save data across chat sessions, our platform is stateless by default. The `h9.input()` function is a slim wrapper over `input()` that also stores the user input in the `messages`. Then `h9.complete()` is a helper function to help parse the completion results and save the result in `messages`. That's about it!

## Development

To make changes to your project, open `chatbot/` in your IDE and modify `chatbot/app.py`.

You can then run your project as follows:

```bash
hal9 run chatbot
```

If you customized your template with `--template` make sure to set the correct key, for example, if you are using the OpenAI template use for Linux or macOS:

```bash
export OPENAI_KEY=YOUR_OPENAI_KEY.
```
For Windows use:

```bash
set OPENAI_KEY=YOUR_OPENAI_KEY.
```

For more information on obtaining and using your OpenAI API key, please refer to the [OpenAI API Key documentation](https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key).


You can then run your application locally with:

```bash
hal9 run chatbot
```

This command is just a convenience wrapper to running the code yourself with something like `python app.py`.

## Deployment

The deploy command will prepare for deployment your generative app.

For example, you can prepare deployment as a generative app. We have plans to also provide deployment to Docker and the open source community can expand this even further.

```bash
hal9 deploy chatbot --target hal9
```

Each command is tasked with preparing the deployment of your project folder. For example, `--target docker` should create a `Dockerfile` file that gets this project ready to run in cloud containers.

For personal use, `--target hal9` supports a free tier at `hal9.com`; enterprise support is also available to deploy with `--target hal9 --url hal9.yourcompany.com`

## Contributing

Apart from deploying your apps directly on [hal9.com/platform](https://hal9.com/platform), you can collaborate with our community by contributing new ones to the [/apps](https://github.com/hal9ai/hal9/tree/main/apps/hal9) directory in this repository. Additionally, you can improve Hal9 AI’s core capabilities by refining the code in the [apps/hal9](https://github.com/hal9ai/hal9/tree/main/apps/hal9) folder.

The `hal9` Python package is located in the [/python](https://github.com/hal9ai/hal9/tree/main/python) directory, while the documentation website resides under [/website](https://github.com/hal9ai/hal9/tree/main/website). We encourage contributors to focus on enhancing apps first before proposing more complex changes.

Keep in mind that the philosophy of the `hal9` package is to remain a lightweight wrapper around `input()` and `print()`. The Python community already offers many excellent frameworks, and we aim to encourage their use rather than creating another one.
