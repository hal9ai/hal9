import os
from openai import OpenAI
import hal9 as h9

# client = OpenAI(base_url="https://api.hal9.com/proxy/server=https://api.openai.com/v1/", api_key = os.environ['HAL9_TOKEN'])
# for local use
client = OpenAI(base_url="http://localhost:5000/proxy/server=https://api.openai.com/v1/", api_key = os.environ['HAL9_TOKEN'])
# for devel
# client = OpenAI(base_url="https://api.devel.hal9.com/proxy/server=https://api.openai.com/v1/", api_key = os.environ['HAL9_TOKEN'])

messages = h9.load("messages", [])
messages.append({"role": "user", "content": input()})

completion = client.chat.completions.create(model = "o1-preview", messages = messages, stream = True)

h9.save("messages", messages, hidden = True)

response = ""
for chunk in completion:
  if chunk.choices and chunk.choices[0].delta and chunk.choices[0].delta.content:
    content = chunk.choices[0].delta.content
    print(content, end="")
    response += content

messages.append({"role": "assistant", "content": response})
h9.save("messages", messages, hidden = True)