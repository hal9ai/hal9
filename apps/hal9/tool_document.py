import hal9 as h9
import openai
import os
import json
import pandas as pd
import requests
import fitz

import warnings
warnings.simplefilter(action='ignore')

from langchain_openai import AzureOpenAIEmbeddings
from io import BytesIO
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sklearn.metrics.pairwise import cosine_similarity
from google.cloud import bigquery
from google.oauth2 import service_account

envvars = os.environ
connection = envvars['CONNECTION']

embeddings = AzureOpenAIEmbeddings(
    client = None,
    azure_deployment = "text-embedding-3-large",
    azure_endpoint = 'https://openai-hal9.openai.azure.com/',
    api_key = os.environ['OPENAI_AZURE'],
    openai_api_type = 'azure',
    chunk_size = 3000,
)

client = openai.AzureOpenAI(
  azure_endpoint = 'https://openai-hal9.openai.azure.com/',
  api_key = os.environ['OPENAI_AZURE'],
  api_version = '2023-05-15',
)

def similarity(embedding1, embedding2):
    return cosine_similarity([embedding1], [embedding2])[0][0]

def similar_text(prompt, df, k=10):
    embedded_prompt = embeddings.embed_query(prompt)
    similarities = df['embeddings'].apply(lambda x: similarity(embedded_prompt, x))
    top_indices = sorted(range(len(similarities)), key=lambda i: similarities[i], reverse=True)[:k]
    return df.iloc[top_indices]

def get_PDFresponse(request, set_verbose):
  files_schema_df = h9.load("document-embeddings", [])
  h9.save("document-embeddings", files_schema_df, hidden = True)

  relevant_passages_text = []
  files_consulted=[]
  files_consulted2=[]
  relevant_passages_rows = similar_text(request, files_schema_df, 5)
  relevant_passages_text += relevant_passages_rows['chunk_content'].to_list()
  files_consulted += relevant_passages_rows["filename"].to_list()

  files_schema_df = files_schema_df.drop(relevant_passages_rows.index.tolist()).reset_index(drop=True)

  for index, row in relevant_passages_rows.iterrows():
    related_passages = similar_text(row['chunk_content'], files_schema_df, 2)
    files_schema_df = files_schema_df.drop(related_passages.index.tolist()).reset_index(drop=True)
    relevant_passages_text += related_passages['chunk_content'].to_list()
    files_consulted2 += related_passages["filename"].to_list()

  text_passages_list = str(relevant_passages_text)
  return call_with_context(request, text_passages_list, set_verbose, files_consulted)

def processPDF(connection):
  #print("Processing text... please wait")
  urls_list = connection.split(',')
  text_splitter = RecursiveCharacterTextSplitter(chunk_size=3000, chunk_overlap=500)

  url_list_df = []
  filename_list = []
  chunk_content_list = []
  embedding_list = []

  for url in urls_list:
    filename = url.split("/")[-1]
    response = requests.get(url)
    pdf_document = fitz.open(stream=BytesIO(response.content))
    all_text = ''.join(page.get_text() for page in pdf_document.pages())
    pdf_document.close()
    text_chunks = text_splitter.split_text(all_text)
    chunks_strings = [(f"From {filename}: "+ str(chunk)) for chunk in text_chunks]
    embedding_results = embeddings.embed_documents(chunks_strings)

    url_list_df.extend([url] * len(text_chunks))
    filename_list.extend([filename] * len(text_chunks))
    chunk_content_list.extend(chunks_strings)
    embedding_list = embedding_list + embedding_results

  files_schema_df = pd.DataFrame({
      'url': url_list_df,
      'filename': filename_list,
      'chunk_content': chunk_content_list,
      'embeddings': embedding_list
  })
  h9.save("document-embeddings", files_schema_df, hidden = True)    
  h9.save("document-summary", get_PDFresponse("Write a very short summary about these documents", False), hidden = True)

  return files_schema_df

def call_with_context(chat_input, added_context, verbose, files_consulted):
  messages2 = h9.load("document-messages", [{ "role": "system", "content": "" }])
  messages2[0]["content"] = "You are operating a chatbot designed to answer questions based solely on specific text passages provided from a PDF file. Each response you generate should rely entirely on these passages, without inferring or assuming additional information. Ensure all answers are directly supported by the text content of the passages."
  messages2.append({"role": "user", "content": f"""Request: {chat_input}
  Text passages: {added_context}
        """})
  completion2 = client.chat.completions.create(
    model = "gpt-4",
    messages = messages2,
    stream = True
  )

  collected_messages2 = []

  for chunk in completion2:
    if chunk.choices and chunk.choices[0].delta and chunk.choices[0].delta.content:
      chunk_message = chunk.choices[0].delta.content  # extract the message
      collected_messages2.append(chunk_message)  # save the message
      if(chunk_message is not None):
        if(verbose):
          print(chunk_message, end="")
  collected_messages2 = [m for m in collected_messages2 if m is not None]
  full_reply_content2 = ''.join(collected_messages2)

  if (verbose):
    print("\n\nSources: " + ", ".join(list(set(files_consulted))))

  return full_reply_content2

def conversation_loop(messages, chat_input):
  # Append the new user input
  messages.append({"role": "user", "content": chat_input})

  # Create a completion request with streaming enabled
  completion = client.chat.completions.create(
    model = "gpt-4",
    messages = messages,
    functions = [
      {
        "name": "get_PDFresponse",
        "description": f"""Gets a response from the PDF text relying entirely on the text using a LLM+RAG tool given a request that describes what is to be retrieved by the tool. Use this tool if the conversation could use answers from these documents.""",
        "parameters": {
          "type": "object",
          "properties": {
            "request": {"type": "string"}
          },
          "required": ["request"]
        }
      }
    ],
    function_call = "auto",
    stream = True
  )

  # Iterate over the streamed responses
  full_response = ""
  function_call_info = None
  function_call_data_complete = False

  toolname =""

  # create variables to collect the stream of chunks
  collected_messages = []
  collected_messages_name = []

  tool = False

  for chunk in completion:
    if(chunk.choices[0].delta.function_call == None):
      if chunk.choices and chunk.choices[0].delta and chunk.choices[0].delta.content:
        chunk_message = chunk.choices[0].delta.content  # extract the message
        collected_messages.append(chunk_message)  # save the message
        print(chunk_message, end="")
    else:
      tool = True
      chunk_message = chunk.choices[0].delta.function_call.arguments  # extract the message
      collected_messages.append(chunk_message)  # save the message
      if(chunk.choices[0].delta.function_call.name != None):
        toolname = chunk.choices[0].delta.function_call.name    

  if(tool):
    collected_messages = [m for m in collected_messages if m is not None]
    full_reply_content = ''.join(collected_messages)
    if(toolname == "get_PDFresponse"):
      data = json.loads(full_reply_content)
      full_reply_content = get_PDFresponse(data.get("request"), True)
    else:
      full_reply_content = "No response"
  else:
    collected_messages = [m for m in collected_messages if m is not None]
    full_reply_content = ''.join(collected_messages)
    
  messages.append({"role": "assistant", "content": full_reply_content})
  h9.save("document-messages", messages, hidden = True)
  return full_reply_content

def document_reply(prompt):
  """
  Can understand links to PDFs and use them to reply to questions
    'prompt' one of two options: (1) A link to a new PDF or (2) A question about a previous PDF link
  """

  if h9.is_url(prompt):
    embeddings = h9.load("document-embeddings", processPDF(prompt))
    prompt = "Acknowledge you understand the document that was provided"
  else:
    embeddings = h9.load("document-embeddings", False)

  if embeddings is False or embeddings.empty:
    print("No PDF file found, please provide at least one")
    return "No PDF file found, please provide at least one"

  docs_summary = h9.load("document-summary", False)
  if not docs_summary:
    print("I was not able to summarize the documents")
    return "Could not summarize the documents"
  
  messages = h9.load("document-messages", [{
    "role": "system",
    "content": f"""You are an assistant that helps the user anser questions based on documentation provided by the chatbot creator. You can use a tool to consult the documentation using a RAG system when you need to get data from the files. A summary of the PDFs follows: {docs_summary} . Try not to mention the filename of the documentation you have access to."""
  }])

  return conversation_loop(messages, prompt)
