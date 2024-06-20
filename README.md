# [Hal9](https://hal9.com/): Create and Share Generative Apps

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Hal9 PyPi Downloads](https://img.shields.io/pypi/dm/hal9?label=PyPI)](https://pypistats.org/packages/hal9)
[![jsDelivr hits (GitHub)](https://img.shields.io/jsdelivr/gh/hm/hal9ai/hal9)](https://www.jsdelivr.com/package/npm/hal9)
[![GitHub star chart](https://img.shields.io/github/stars/hal9ai/hal9?style=flat-square)](https://star-history.com/#hal9ai/hal9)

Create and deploy generative ([LLMs](https://github.com/Hannibal046/Awesome-LLM) and [diffusers](https://github.com/huggingface/diffusers)) applications (chatbots and APIs) in seconds.
- **Open:** Use any model ([OpenAI](https://platform.openai.com/docs/api-reference/introduction), [Llama](https://ai.meta.com/blog/5-steps-to-getting-started-with-llama-2/), [Groq](https://docs.api.groq.com/md/tutorials/python.groqapi.html), [MidJourney](https://docs.imagineapi.dev/en)) and any library like ([LangChainl](https://python.langchain.com/v0.1/docs/get_started/quickstart/), [DSPy](https://dspy-docs.vercel.app/docs/quick-start/installation)).
- **Intuitive:** No need to learn app frameworks ([Flask](https://flask.palletsprojects.com/en/3.0.x/quickstart/)), simply use `input()` and `print()`, or write file to disk.
- **Scalable:** Engineers can integrate your app with scalable technologies ([Docker](https://www.docker.com/), [Kubernetes](https://kubernetes.io/), etc)
- **Powerful:** Using an OS process (stdin, stdout, files) as our app contract, enables long-running agents, multiple programming languages, and complex system dependencies.

Focus on AI (RAG, fine-tuning, alignment, training) and skip engineering tasks (frontend development, backend integration, deployment, operations).

## Getting started

Create and share a chatbot in seconds by running the following commands:

```bash
pip install hal9

hal9 create chatbot
hal9 deploy chatbot
```

To customize further, read the following sections.

## Creation

By default `hal9 create` we will use the OpenAI template, you can choose different ones as follows:

```bash
hal9 create my-chatbot --template openai
hal9 create my-chatbot --template midjourney
hal9 create my-chatbot --template groq
hal9 create my-chatbot --template langchain
```

A template provides ready to use code with specific technologies and use cases. If you already have code, you can skip this step.

## Development

To make changes to your project, open `my-chatbot/` in your IDE and modify `my-chatbot/app.py`.

You can then run your project as follows:

```bash
cd my-chatbot

pip install -r requirements.txt

export OPENAI_KEY=YOUR_OPENAI_KEY
```

If you customized your template with `--template` make sure to set the correct key, for example `export GROQ_KEY=YOUR_GROQ_KEY`.

You can then run your application locally with:

```bash
hal9 run .
```

or

```bash
cd ..
hal9 run my-chatbot
```

This command is just a convenience wrapper over `python app.py`

## Deployment

The deploy command will prepare for deployment your generative app.

For example, you can prepare deployment as a generative app (Hal9), an API (Flask), a data app (Streamlit), or a container (Docker).

```bash
hal9 deploy my-chatbot --target hal9
hal9 deploy my-chatbot --target docker
```

Each command is tasked with preparing the deployment of your project folder. For example, `--target docker` will create a `Dockerfile` file that gets this project ready to run in cloud containers.

For personal use, `--target hal9` supports a free tier at `hal9.com`; enterprise support is also available to deploy with `--target hal9 --url hal9.yourcompany.com`

## Contributing

Pull Requests are welcomed to consider additional application templates or deployment targets. See [CONTRIBUTING](CONTRIBUTING).

