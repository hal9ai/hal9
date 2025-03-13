---
slug: langchain
title: "PDF Chatbot with LangChain and Hal9: A Step-by-Step Guide" 
authors: [luis]
tags: [LangChain, RAG, PDF]
image: https://hal9.com/docs/screenshots/langchain-light.png
---

import ThemedImage from '../../src/components/themedimg.jsx'

## **Overview**

LangChain is a powerful framework designed to simplify the integration of Large Language Models (LLMs) into applications. It provides developers with modular tools and pre-built components for tasks like document analysis, summarization, chatbots, and even code analysis. By offering a robust pipeline for chaining LLM-powered steps together, LangChain allows developers to build advanced applications while maintaining flexibility and control.

When combined with Hal9, a platform that streamlines the deployment and creation of chatbots while offering access to a wide variety of models, developers gain the ability to rapidly build and deploy intelligent, scalable solutions. This guide demonstrates how these tools can be used together to create a chatbot that interacts with PDF documents.

---

## **PDF ChatBot Workflow**


### **1. Input Handling**

When a user interacts with the chatbot via Hal9’s chat interface, uploaded documents are received as URLs on the Python side. The chatbot determines whether the input is a document URL or a question related to previously loaded data. If it’s a document, the content is parsed and stored for future interaction; otherwise, the chatbot uses existing data to generate a response or provides a general answer

```python
user_input = h9.input()
# Check if the user input is a file URL (e.g., uploaded via Hal9 interface)
if h9.is_url(user_input): 
    # Process the file and store extracted content for later use
    pass
else:
    # Handle the query by retrieving context or generating a generic response
    pass
```

### **2. Document Processing and Storage**


The process of extracting, storing, and referencing document content is made efficient through LangChain’s flexible document loaders. For instance, when handling a PDF file, we utilize the `PyMuPDFLoader` to load the document’s text and store it for later use. 

LangChain provides various document loaders, which allow integration with multiple data sources like PDFs, CSVs, and others. Once the document is loaded into memory, it's serialized and saved using Python's `pickle` module, ensuring persistence across sessions. This enables the chatbot to quickly reference previously loaded documents.

```python
def save_documents(documents, file_path):
    with open(file_path, "wb") as f:
        pickle.dump(documents, f)

loader = PyMuPDFLoader(user_input)
documents = loader.load()

save_documents(documents, documents_file)
```

### **3. Embeddings, Chroma, and Context Retrieval**

To enable efficient retrieval of relevant information, document content is transformed into embeddings—numerical representations that capture semantic meaning. Using OpenAIEmbeddings model from LangChain integrated with Hal9’s API, these embeddings allow the chatbot to compare and rank document sections by their relevance to a user's query. Chroma, an AI-native vector database, stores these embeddings, providing a scalable and efficient way to manage and search through large collections of documents.

When a user submits a query, Chroma performs a similarity search across the stored embeddings to identify the most relevant document sections. The results are then formatted into a cohesive context that the chatbot can use to generate accurate and context-aware responses.

```python
embeddings = OpenAIEmbeddings(openai_api_base="https://api.hal9.com/proxy/server=https://api.openai.com/v1", api_key=os.environ['HAL9_TOKEN'], model="text-embedding-3-large")

db = Chroma.from_documents(documents, embeddings)

docs = db.similarity_search(user_input, k=6)

formatted_context = "\n".join([doc.page_content for doc in docs])
```

### **4. Selecting LLMs and Generating Responses**

The Hal9 platform allows seamless integration with multiple language models and providers, such as LLaMA from Groq, R1 from DeepSeek, and OpenAI’s GPT models. By combining Hal9’s capabilities with LangChain’s ChatOpenAI class, developers can easily access and invoke these diverse models to generate responses. This flexibility empowers users to tailor their applications to specific use cases, optimizing for factors like speed, accuracy, or model capabilities.

In the code example below, we demonstrate how to configure the ChatOpenAI class to interact with these models. Here, we choose Groq + LLaMA for its exceptional speed, but you can experiment with other models by adjusting the configurations as shown

```python
# Configure the model with Hal9's API and desired provider
llm = ChatOpenAI(base_url="https://api.hal9.com/proxy/server=https://api.groq.com/openai/v1", api_key=os.environ['HAL9_TOKEN'], model="llama3-8b-8192")
response = llm.invoke(messages)  # Generate a response using Groq + LLaMA

# To switch to OpenAI GPT-4 or DeepSeek R1, change the base_url and model parameters
llm = ChatOpenAI(base_url="https://api.hal9.com/proxy/server=https://api.openai.com/v1/", api_key=os.environ['HAL9_TOKEN'], model="gpt-4-turbo")
llm = ChatOpenAI(base_url="https://api.hal9.com/proxy/server=https://api.deepseek.com", api_key=os.environ['HAL9_TOKEN'], model="deepseek-reasoner")
```

### **5. Message History Management and Persistence**

To maintain conversational continuity, the chatbot needs to track and store the interaction history. Hal9 simplifies this process by offering save and load functions that allow seamless management of message histories. Every user interaction is appended to a list of messages, which is then saved persistently.

This history is passed to the ChatOpenAI function during each invocation, ensuring the model has the necessary context to generate responses that align with the ongoing conversation.

```python
messages = h9.load("messages", [])
messages.append({"role": "system","content": "You are an assistant designed to..."}) 
messages.append({"role": "human", "content": user_input})   
messages.append({"role": "assistant", "content": response})
h9.save("messages", messages, hidden=True)
```

### **Explore the Results**

Ready to see the chatbot in action? Test it out by uploading a PDF or sharing a link to experience its capabilities firsthand. [Click here to test the chatbot](https://hal9.com/luis/langchain).

Want to dive deeper? Access the full implementation and customize it to your needs by exploring the code on GitHub: [Hal9 LangChain Repository](https://github.com/LuisGuillen03/Hal9_LangChain).

<center><a href="https://hal9.com/luis/langchain"><ThemedImage src="langchain"/></a></center>

---

### **Conclusion**

Integrating LangChain with Hal9 opens up new possibilities for building sophisticated, PDF-interacting chatbots. This combination leverages LangChain’s modularity and robust document handling capabilities alongside Hal9’s streamlined deployment and multi-model support. By utilizing embeddings, vector databases like Chroma, and flexible LLM integration, developers can create chatbots capable of delivering precise, context-aware responses. The workflow, from input handling to response generation, ensures scalability and adaptability to various use cases, making this setup an ideal choice for applications that demand intelligent document interaction. Whether you're developing a research assistant, legal document analyzer, or customer support tool, this guide provides a strong foundation to get started.

### **References**

- [Build a Retrieval Augmented Generation (RAG) App: Part 1](https://python.langchain.com/docs/tutorials/rag/)  
- [Build a PDF ingestion and Question/Answering system](https://python.langchain.com/v0.2/docs/tutorials/pdf_qa/)