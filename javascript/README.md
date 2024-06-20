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

# Development

Local setup

```
yarn clean && yarn install
```

Live development

```
yarn dev
```
