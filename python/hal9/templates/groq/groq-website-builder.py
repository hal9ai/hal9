from groq import Groq
import os
import hal9 as h9
import json 

client = Groq()

messages = h9.load("messages", [{ "role": "system", "content": "This is a single page HTML website generator that automates the creation of web apps based on user prompts." }])
messages.append({"role": "user", "content": input()})

stream = client.chat.completions.create(
    model="llama3-70b-8192",
    messages=messages,
    temperature=0,
    max_tokens=8192,
    top_p=1,
    stream=True,
    stop=None,
    seed=1,
)

response = ""
for chunk in stream:
  if len(chunk.choices) > 0 and chunk.choices[0].delta.content is not None: 
    print(chunk.choices[0].delta.content or "", end="")
    response = response + chunk.choices[0].delta.content

messages.append({"role": "ai", "content": response})

code = h9.extract(markdown=response,language="html")
h9.save("index.html", code, hidden=False)
