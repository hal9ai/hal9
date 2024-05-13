# Hal9: Create and Share Generative Apps

[![Hal9 PyPi Downloads](https://img.shields.io/pypi/dm/hal9?label=PyPI)](https://pypi.org/project/hal9/)

Create and deploy generative (LLMs and [difussers](https://github.com/huggingface/diffusers)) applications (chatbots and APIs) in seconds.
- **Open:** Use any model (OpenAI, Llama, Groq, Midjourney) and any library like (LangChainl, DSPy).
- **Intuitive:** No need to learn app frameworks (flask), simply use stdin and stdout, or write file to disk.
- **Scalable:** Engineers can integrate your app with scalable technilogies (Docker, Kubernetes, etc)
- **Powerful:** Using an OS process (stdin, stdout, files) as our app contract, enables long-running agents, multiple programming languages, and complex system dependencies.

Focus on AI (RAG, fine-tuning, aligment, training) and skip engineering tasks (frontend development, backend integration, deployment, operations).

## Getting started

To create and share a chatbot in seconds by running the following commands:

```bash
pip install hal9

hal9 create chatbot
hal9 deploy chatbot
```

To customize further, read the following sections.

## Creation

By default `hal9 create` we will use the OpenAI template, you can choose different ones as follows:

```bash
hal9 create my-project --template openai
hal9 create my-project --template midjourney
hal9 create my-project --template groq
hal9 create my-project --template langchain
```

A template provides ready to use code with specific technologies and use cases. If you already have code, you can skip this step.

## Development

To make changes to your project, open `my-project/` in your IDE and modify `my-project/app.py`.

You can then run your project as follows:

```bash
cd my-project

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
hal9 run my-project
```

This command is just a convenience wrapper over `python app.py`

## Deployment

The deploy command will prepare for deployment your generative app.

For example, you can prepare deployment as a generative app (Hal9), an API (Flask), a data app (Streamlit), or a container (Docker).

```bash
hal9 deploy my-project --target hal9
hal9 deploy my-project --target docker
```

Eeach command is tasked with preparing the deployment of your project folder. For example, `--target docker` will create a `Dockerfile` file that gets this project ready to run in cloud containers.

For personal use, `--target hal9` supports a free tier at `hal9.com`; enterprise support is also available to deploy with `--target hal9 --url hal9.yourcompany.com`

## Contributing

Pull Requests are welcomed to consider additional application templates or deployment targets. See [CONTIBUTE.md](CONTIBUTE.md).

