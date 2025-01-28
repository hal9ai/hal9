---
slug: dspy
title: "PDF Chat Agent with DSPy and Hal9" 
authors: [luis]
tags: [DSPy, RAG, Chain of Thought]
---

import ThemedImage from '../../src/components/themedimg.jsx'

### **Harnessing DSPy for Simplified AI Programming**

In the world of Large Language Models (LLMs), DSPy emerges as a game-changer for programming, focusing on abstraction rather than low-level prompt engineering. Unlike traditional approaches that require manually crafting complex prompts, DSPy lets you describe tasks naturally using **signatures**—declarative specifications of inputs and outputs. This allows for easier program construction without getting bogged down in prompt formatting or manual adjustments. 

With DSPy, you can build advanced AI-powered systems like a PDF chat agent with much less effort, shifting the focus from managing prompts to constructing modular, efficient AI programs. This post will demonstrate how to leverage DSPy’s powerful modules to create a document-interacting chatbot, while using Hal9’s robust infrastructure to deploy and interact with OpenAI's LLMs effortlessly.

---

### **DSPy Fundamentals**

#### **Signatures: Simplifying Tasks**

At the heart of DSPy are **signatures**, which specify what an LLM should do in plain language. Instead of manually crafting detailed prompts, you declare the task’s input and output types. For example:

```python
'sentence -> sentiment: bool'
'document -> summary'
```

This high-level abstraction allows you to focus on the desired behavior rather than the exact phrasing of the prompt. The power of signatures lies in their simplicity and adaptability, which make them an excellent tool for developers who want to interact with LLMs without needing to know the intricacies of prompt engineering. With DSPy, you can specify what you want—whether it’s summarizing a document or extracting sentiment—and let the framework handle the underlying complexity.

#### **Modules: The Building Blocks**

Once you've defined your task with a signature, DSPy uses **modules** to handle different prompting techniques. These modules abstract away the details of the interaction, offering an easy way to apply complex prompting strategies.

Modules can incorporate advanced techniques like **Chain of Thought** (CoT) or **ReAct**, allowing you to tailor the prompt's behavior for specific tasks. For example, if you need reasoning steps for a complex task, you might use the **Chain of Thought** module, which helps the LLM break down the problem into smaller, manageable pieces.

DSPy also offers flexibility by enabling you to create custom modules to suit more specialized use cases. These modules work as building blocks that can be connected together to form more complex pipelines.

#### **Chain of Thought: Structured Reasoning**

One key module, **Chain of Thought**, facilitates structured reasoning, which can enhance the performance of the model for complex tasks. This method allows the LLM to think step-by-step before generating an answer, reducing errors that might arise from direct responses. For example, when asked a complex question, the LLM may break the process into logical steps, providing a more comprehensive response.

By using Chain of Thought, you can enable the model to deliver responses with more nuance and accuracy, perfect for applications requiring deeper understanding or reasoning.

#### **Plugging in Any LLM: Focused on Programming, Not Prompting**

One of DSPy’s key strengths is the ability to integrate any LLM of your choice with ease. In this case, we’ve seamlessly integrated DSPy with Hal9's proxy infrastructure.

```python
lm = dspy.LM('openai/gpt-4-turbo', api_key='hal9', api_base='https://api.hal9.com/proxy/server=https://api.openai.com/v1/')
dspy.configure(lm=lm)
```

#### Retrieval-Augmented Generation (RAG)

RAG combines LLM reasoning with retrieval mechanisms. Instead of relying solely on the model's internal knowledge, RAG searches an external corpus (e.g., document chunks) to retrieve relevant context. This retrieved information is then fed into the LLM for accurate and context-aware answers. DSPy simplifies the creation of RAG pipelines, as you'll see in the implementation.

### **Building a Document-Interacting Chatbot**

Now that we understand the principles of DSPy, Chain of Thought and RAG , let’s dive into building a simple chatbot that interacts with PDF documents. We’ll break this process down into manageable sections.

#### **Step 1: Text Processing**

Before we can interact with the document, we need to process and split its content into chunks. Here, we’ll extract text from a PDF document, and split it into smaller, overlapping chunks to allow efficient searching.

```python
def extract_text_from_pdf(pdf_url):
    response = requests.get(pdf_url)
    pdf_document = fitz.open(stream=BytesIO(response.content))
    text = "".join([pdf_document[page_num].get_text() for page_num in range(len(pdf_document))])
    return text

def split_text(text, n_words=300, overlap=0):
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        chunk = words[start:start + n_words]
        chunks.append(" ".join(chunk))
        start += n_words - overlap
    return chunks
```

#### **Step 2: Embedding Generation**

We use a custom retriever class that integrates with a vectorizer leveraging Hal9's proxy for OpenAI to generate embeddings, storing them in a FAISS index for efficient retrieval.

The CustomOpenAIVectorizer is used to generate embeddings for document chunks by calling the Hal9-proxied OpenAI API. This vectorizer batches requests to optimize processing time. After generating embeddings, we store them in a FAISS index, either updating or creating a new one based on the provided configuration.

The Hal9_FaissRM class handles both embedding generation and indexing. It ensures that the embeddings are properly stored and can be quickly retrieved using FAISS, which optimizes search efficiency during querying.

```python
from custom_dspy import CustomOpenAIVectorizer, Hal9_FaissRM

# Initialize the OpenAI client with the Hal9 proxy
openai_client = OpenAI(
    base_url="https://api.hal9.com/proxy/server=https://api.openai.com/v1/",
    api_key="hal9"
)

# Create the vectorizer with the custom OpenAI client
vectorizer = CustomOpenAIVectorizer(openai_client=openai_client)

# Initialize FaissRM
frm = Hal9_FaissRM(document_chunks = chunks, vectorizer = vectorizer, update = True)
```

#### **Step 3: Setting Up the RAG Module and Response Signature**

First, the signature is defined for the answer generation process, where the context (document passages) and the question are input fields, and the generated detailed answer is the output.

The RAG module consists of two key components: a retriever to fetch the relevant passages based on the question and a Chain of Thought model for generating detailed answers. The retriever fetches context, and the Chain of Thought model generates the final answer by combining the context with the question.

```python
# DSPy Signature
class GenerateAnswer(dspy.Signature):
    context = dspy.InputField(desc="Context passages or facts")
    question = dspy.InputField()
    answer = dspy.OutputField(desc="Detailed and long answer generated referenced on passages")

# RAG module definition
class RAG(dspy.Module):
    def __init__(self, num_passages=5):
        super().__init__()
        self.retrieve = dspy.Retrieve(k=num_passages)
        self.generate_answer = dspy.ChainOfThought(GenerateAnswer)

    def forward(self, question):
        context = self.retrieve(question).passages
        prediction = self.generate_answer(context=context, question=question)
        return prediction
```

#### **Step 4: Generate a Response**

Now, we integrate the components into a working example. The user provides a prompt (e.g., a question), and the system uses the updated RAG (Retrieval-Augmented Generation) module to retrieve relevant document chunks and generate a coherent response.

```python
# Configure DSPy
lm = dspy.LM('openai/gpt-4-turbo', api_key='hal9', api_base='https://api.hal9.com/proxy/server=https://api.openai.com/v1/')
frm = Hal9_FaissRM(document_chunks=chunks, vectorizer=vectorizer)
dspy.configure(lm=lm, rm=frm)

# Initialize RAG and generate a response
rag = RAG()
response = rag(question=prompt)
print(response.answer)
```
In this flow, DSPy is configured with an OpenAI model and a retrieval module based on the Hal9_FaissRM retriever, which utilizes the Hal9 proxy for embedding generation and FAISS for efficient document chunk retrieval. The RAG module then uses this setup to generate the final answer based on the provided question.

### **Check the Results**

Curious about how it performs? Try the PDF-interacting chatbot yourself! Upload a PDF or provide a link, and see how it answers questions based on the document's content. [Click here to test the chatbot](https://hal9.com/luis/dspy).

Check out the full code on GitHub: [Hal9 DSPy Repository](https://github.com/LuisGuillen03/Hal9_DSPy).

<center><a href="https://hal9.com/luis/dspy"><ThemedImage src="dspy"/></a></center>

---

### **Conclusion**

DSPy revolutionizes the way we program large language models (LLMs) by shifting the focus from manual prompt engineering to intuitive program design. With its powerful abstractions like signatures and modules, DSPy simplifies the creation of complex systems, such as a chatbot that interacts with documents using Retrieval-Augmented Generation (RAG).

This integration between DSPy and Hal9 showcases how you can develop scalable, modular applications with ease. By following the steps in this blog, you’ve seen how DSPy enables a seamless approach to AI programming, helping developers stay focused on building logic rather than managing prompts.

### **References**

- [DSPy GitHub Repository](https://github.com/stanfordnlp/dspy)  
- [Pipelines and Prompt Optimization with DSPy](https://www.dbreunig.com/2024/12/12/pipelines-prompt-optimization-with-dspy.html)  
- [Exploratory Tour of DSPy](https://medium.com/the-modern-scientist/an-exploratory-tour-of-dspy-a-framework-for-programing-language-models-not-prompting-711bc4a56376)