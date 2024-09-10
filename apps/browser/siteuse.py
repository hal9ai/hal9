import hal9 as h9
from openai import OpenAI

system_prompt = """
Only write python code using pyppeteer to perform the user request. The code will be run dynamically with eval().

The page is already stored as a page variable that you can use.

The following code has already been executed:
import pyppeteer
browser = await pyppeteer.launch()
page = await browser.newPage()

At the beginning of the code, use print() to communicate what the code will do.
Only reply with a code block for python code.
"""

def site_use(prompt, current):
  messages = [
    { "role": "system", "content":  system_prompt},
    { "role": "user", "content": f"Page alredy in page {current}. User requests: {prompt}" }
  ]
  completion = OpenAI().chat.completions.create(model = "gpt-4", messages = messages)
  content = completion.choices[0].message.content
  extracted = h9.extract(content, language = "*")
  if not extracted or len(extracted) == 0:
    return content
  return extracted
