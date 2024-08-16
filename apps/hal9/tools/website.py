import hal9 as h9
import openai
import os
import json

def build_website(prompt):
  """
  Builds or modifies a website based on user description or a change request
    'prompt' with user change or requirements
  """
  client = openai.AzureOpenAI(
    azure_endpoint = 'https://openai-hal9.openai.azure.com/',
    api_key = os.environ['OPENAI_AZURE'],
    api_version = '2023-05-15',
  )

  system = """You can build html applications for user requests. Your replies can include markdown code blocks but they must include a filename parameter after the language. For example,
  ```javascript filename=code.js
  ```

  The main html file must ne named index.html. You can generate other web files like javascript, css, svg that are referenced from index.html
  """

  state = h9.load("website-state", { "messages": [{"role": "system", "content": system}], "files": {} })
  messages = state["messages"]
  files = state["files"]

  messages.append({"role": "user", "content": prompt})

  completion = client.chat.completions.create(model = "gpt-4", messages = messages, stream = True)
  response = h9.complete(completion, messages, show = False)

  files = h9.extract(response, default=files)

  h9.save("website-state", { "messages": messages, "files": files }, hidden=True)
  h9.save("index.html", files=files)

  messages.append({"role": "user", "content": "briefly describe what was accomplished"})
  completion = client.chat.completions.create(model = "gpt-4", messages = messages)
  summary = h9.complete(completion, messages, show = False)
  print(summary)
  return summary
