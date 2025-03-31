import hal9 as h9
from groq import Groq
import os

system_prompt = """
Only reply with website urls that best match the task from the user prompt.
If you don't know a website use https://www.google.com/search?q=query and 
replace query with a reasonable search query for the user task
"""

def site_find(prompt):
  messages = [{ "role": "system", "content":  system_prompt}, { "role": "user", "content": prompt }]
  completion = Groq(base_url="https://api.hal9.com/proxy/server=https://api.groq.com/", api_key=os.environ['HAL9_TOKEN']).chat.completions.create(model = "llama3-70b-8192", messages = messages)
  return completion.choices[0].message.content
