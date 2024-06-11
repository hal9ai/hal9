---
sidebar_position: 1
---

# Intro

[Hal9](https://hal9.com) is a deployment platform for [Generative Applications](../genapps/intro.md) -- All the concepts we learned in previous section are compatible with Hal9 and can be easily deployed with the following bennefits:

- **Open:** Hal9 is based on open source code using popular generative AI libraries, making it open to any LLM, any vector DB, and any library or service.
- **Intuitive:** When a generative app runs on Hal9, we enhance the user interface to make it intuitive to non-technical users. We provide chat history, assets library and run web apps for them automatically.
- **Scalable:** Hal9 is built on Kubernetes which means that generative apps can scale to an arbitrary amount of users. For example, Google runs 8.5 billion searches per day with on an internal Kubernetes-like cluster named Borg.
- **Powerful:** At the end of the day, you are writting code to power your generative apps. There is nothing code can't do in computer systems, since all computer software is written in code.

## Deployment

To explicitly deploy code to Hal9 one can use the Hal9 Command Line Interface (**CLI**) as follows:

```bash
pip install hal9

hal9 create chatbot
hal9 deploy chatbot
```

To deploy other application types use the `type` parameter as follows:

```bash
pip install hal9

hal9 create webapp --type streamlit
hal9 deploy webapp --type streamlit
```

Same for Flask APIs:

```bash
pip install hal9

hal9 create webapi --type flask
hal9 deploy webapi --type flask
```

Or you can even send a pull request to [Hal9's GitHub](https://github.com/hal9ai/hal9) project to extend this to any other applications.
