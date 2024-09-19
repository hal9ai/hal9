import os
from openai import OpenAI
import hal9 as h9

messages = h9.load("messages", [])
client = OpenAI(
    base_url="https://api.devel.hal9.com/proxy/server=https://api.openai.com/v1/",
    api_key = "hal9"
)


completion = client.chat.completions.create(
  model = "o1-preview",
  messages = [
    {"role": "user", "content": input()},
  ]
 )

h9.save("messages", messages, hidden = True)

print(completion.choices[0].message.content)