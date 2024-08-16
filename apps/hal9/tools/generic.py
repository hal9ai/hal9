from groq import Groq
import os
import hal9 as h9
import json

def generic_reply(prompt):
   """
   Reply to anything that other tools do not support.
     'prompt' to respond to.
   """

   messages = h9.load("messages", [])
   messages = [msg for msg in messages if ("tool_calls" not in msg and "tool_call_id" not in msg)]

   response = Groq().chat.completions.create(
     model = "llama3-70b-8192",
     messages = messages,
     temperature = 0,
     seed = 1)

   stream = Groq().chat.completions.create(model = "llama3-70b-8192", messages = messages, temperature = 0, seed = 1, stream = True)

   response = ""
   for chunk in stream:
     if len(chunk.choices) > 0 and chunk.choices[0].delta.content is not None: 
       print(chunk.choices[0].delta.content, end="")
       response += chunk.choices[0].delta.content

   return response

