import hal9 as h9
import openai
import os
import sys
import pandas as pd
import json

envvars = os.environ
client = openai.AzureOpenAI(
  azure_endpoint = 'https://openai-hal9.openai.azure.com/',
  api_key = os.environ['OPENAI_AZURE'],
  api_version = '2023-05-15',
)

def get_system_prompt(connection):
  df = pd.read_csv(connection)

  x = pd.DataFrame(df.dtypes).reset_index().rename({'index': 'column', 0: 'data type'}, axis='columns')
  x['data type'] = x['data type'].apply(lambda x: str(x))
  schema = x.to_json(orient='records', lines=True)

  def truncate_string(s, chars):
    return s[:chars] + '...' if len(s) > chars else s
  head = df.head().applymap(lambda x: truncate_string(x, 40) if isinstance(x, str) else x)
  head = head.to_string()

  return f"""You are an assistant that writes python code for a streamlit app using plotly given a url to a CSV stored in '{connection}'. Your goal is to fullfill user requests. Load the file from the given URL. The CSV has columns and dtypes:

  {schema}

  The contents of the csv look like:

  {head}

  """

def csv_reply(prompt):
  """
  Can understand links to CSVs and use them to reply to questions
    'prompt' one of two options: (1) A link to a new CSV or (2) A question about a previous CSV link
  """

  messages = h9.load("csv-messages", [])
  if h9.is_url(prompt):
    messages = [{
      "role": "system",
      "content": get_system_prompt(prompt)
    }, {
      "role": "user",
      "content": "Acknowledge you understand the CSV that was provided"
    }]
  else:
    messages.append({"role": "user", "content": prompt})

  completion = client.chat.completions.create(
    model = "gpt-4",
    messages = messages,
    temperature = 0,
    frequency_penalty=0.3,
  )

  response = completion.choices[0].message.content
  messages.append({"role": "assistant", "content": response})
  h9.save("csv-messages", messages, hidden = True)

  code = h9.extract(markdown=response, language="python")
  if code is None:
    print(response)
  else:
    h9.save("app.py", code)

  return "You now have access to a CSV file and can use this tool again for follow up questions"
