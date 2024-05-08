# Hal9: Create and Deploy GenAI Chatbots

[![Hal9 PyPi Downloads](https://img.shields.io/pypi/dm/hal9?label=PyPI)](https://pypi.org/project/hal9/)

Create and deploy Large Language Model (LLM) chatbots in seconds.
- **Open:** Use any LLM like OpenAI, LLama, Gemini, Groq, etc. and open libraries like LangChain.
- **Intuitive:** No need to learn a chat framework, simply use stdin and stdout.
- **Scalable:** Engineers can esily integrate your chatbot with Docker or use Hal9's self-service enterprise cloud.

## Getting started

To create and deploy a chatbot in 10 seconds run the following:

```bash
pip install hal9

hal9 create my-project
hal9 deploy my-project
```

To customize, read the following sections.

## Creation

By default `hal9 create` we will use OpenAI, you can choose your template as follows:

```bash
hal9 create my-project --template openai
hal9 create my-project --template groq
hal9 create my-project --template langchain
```

Send a PR if you want to add additional templates.

## Development

To make changes to your project, open `my-project/` in your IDE and modify `my-project/app.py`.

You can then run your project as follows:

```bash
cd my-project

pip install -r requirements.txt

export OPENAI_KEY=YOUR_OPENAI_KEY
python app.py
```

If you customized your template with `--template` make sure to set the correct key, for example `export GROQ_KEY=YOUR_GROQ_KEY`.

## Runtime

Use the command line tool to enter prompts, type `<enter>` twice to send the prompt to your code. Replies will be streamed back to console.

We decided to use a simple chat interface to help AI teams focus what matters: Retrieval Augmented Generation (RAG) workflows. The interactivity and backend can be left to the engineering team or services like Hal9.

## Deployment

We currently support Docker and Hal9 Cloud, but community can send PR's with additional technologies or providers.

### Docker

To deploy your project through Docker run:

```bash
docker build .
docker run .
```

Your backend and frontend engineers can then easily consume this as an API. You can share the `my-project/` path as a GitHub repo with your infrastructure team for them to deploy to your cloud provider. There are GitHub actions available to build and deploy Docker images.

### Hal9

To deploy to Hal9's cloud run:

```bash
hal9 deploy my-project --email email@email.com
```
