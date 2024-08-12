import hal9 as h9
import openai
import os
import json

def build_streamlit(prompt):
  """
  Builds or modifies a streamlit application ideal to solve problems with Python that require data analysis
    'prompt' with user change or requirements
  """
  client = openai.AzureOpenAI(
    azure_endpoint = 'https://openai-hal9.openai.azure.com/',
    api_key = os.environ['OPENAI_AZURE'],
    api_version = '2023-05-15',
  )

  system = """
This is a Python streamlit generator system that automates the creation of Streamlit apps
based on user prompts. It interprets natural language queries, and the response is an interactive
Streamlit app. Do not add code or instructions to run the app or to install packages. You can use
Plotly for charts. You don't have access to CSV files unless the user provides an explicit URL.
"""

  messages = h9.load("streamlit-messages", [{"role": "system", "content": system}])
  messages.append({"role": "user", "content": prompt})

  completion = client.chat.completions.create(model = "gpt-4", messages = messages, stream = True)
  response = h9.complete(completion, messages)

  code = h9.extract(response, language="py")

  h9.save("streamlit-messages", messages, hidden=True)
  h9.save("app.py", code)

  return response
