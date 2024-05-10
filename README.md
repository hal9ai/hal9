# Hal9: Create and Share Generative Apps

[![Hal9 PyPi Downloads](https://img.shields.io/pypi/dm/hal9?label=PyPI)](https://pypi.org/project/hal9/)

Create and deploy generative (LLMs and [difussers](https://github.com/huggingface/diffusers)) applications (chatbots and APIs) in seconds.
- **Open:** Use any model (OpenAI, Llama, Groq, Midjourney) and any library like (LangChainl, DSPy).
- **Intuitive:** No need to learn an app framework (streamlit, flask), simply use stdin and stdout.
- **Scalable:** Engineers can esily integrate your app with Docker or use Hal9's self-service enterprise cloud.

Focus on AI (RAG, fine-tuning, aligment, training) and skip engineering tasks (frontend development, backend integration, deployment, operations).

## Getting started

To create and deploy a chatbot in 10 seconds run the following:

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

Send a PR if you want to add additional templates.

## Development

To make changes to your project, open `my-project/` in your IDE and modify `my-project/app.py`.

You can then run your project as follows:

```bash
cd my-project

pip install -r requirements.txt

export OPENAI_KEY=YOUR_OPENAI_KEY
```

If you customized your template with `--template` make sure to set the correct key, for example `export GROQ_KEY=YOUR_GROQ_KEY`.

## Runtime

Run your application as follows,

```python
python app.py
```

Use the command line tool to enter prompts, type `<enter>` twice to send the prompt to your code. Replies will be streamed back to console.

From the parent folder, you can also run your application as follows:

```bash
hal9 run my-project
```

## Deployment

We currently support Docker and `hal9.com`. Developers can send PR's with additional technologies or providers.

### Docker

To deploy your project through Docker run:

```bash
docker build .
docker run .
```

Your backend and frontend engineers can then easily consume this as an API. You can share the `my-project/` path as a GitHub repo with your infrastructure team for them to deploy to your cloud provider. There are GitHub actions available to build and deploy Docker images.

### Hal9

To deploy to `hal9.com` run:

```bash
hal9 deploy my-project --target hal9.com
```

When Hal9 runs in your own cloud you can replace `--target hal9.com` with the correct domain, for example:

```bash
hal9 deploy my-project --target hal9.acme.com
```
