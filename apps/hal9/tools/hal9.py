from groq import Groq
import os
import hal9 as h9
import json

def hal9_reply(prompt):
  """
   Reply to questions about Hal9.
     'prompt' to respond to.
  """

  context = open('tools/hal9.txt', 'r').read()
  messages = [
    {"role": "system", "content": context},
    {"role": "user", "content": prompt}
  ]

  stream = Groq().chat.completions.create(model = "llama3-70b-8192", messages = messages, temperature = 0, seed = 1, stream = True)

  response = ""
  for chunk in stream:
    if len(chunk.choices) > 0 and chunk.choices[0].delta.content is not None: 
      print(chunk.choices[0].delta.content, end="")
      response += chunk.choices[0].delta.content

  return response
