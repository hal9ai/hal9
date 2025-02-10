import hal9 as h9
import openai
import os

def website_generator(prompt):
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
  return summary

website_generator_description = {
    "type": "function",
    "function": {
        "name": "website_generator",
        "description": "This function creates or modifies a website based on a user's description or change requests. It dynamically generates HTML, CSS, JavaScript, and other web assets as specified in the input prompt. The function maintains a stateful interaction, allowing for iterative website building and modification.",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "prompt": {
                    "type": "string",
                    "description": "A user-provided description of the website requirements or specific modification requests.",
                },
            },
            "required": ["prompt"],
            "additionalProperties": False,
        },
    },
}