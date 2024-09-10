import hal9 as h9
from groq import Groq

system_prompt = """
Only write python code using selenium to perform the user request. The code will be run dynamically with eval().

The driver already stored as a driver variable.

The following includes have been defined:
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

At the beginning of the code, use print() to communicate what the code will do.
Only reply with a code block for python code.
"""

def site_use(prompt, current):
  messages = [
    { "role": "system", "content":  system_prompt},
    { "role": "user", "content": f"Driver alredy in page {current}. User requests: {prompt}" }
  ]
  completion = Groq().chat.completions.create(model = "llama3-70b-8192", messages = messages)
  content = completion.choices[0].message.content
  extracted = h9.extract(content, language = "*")
  if len(extracted) == 0:
    return content
  return extracted
