import hal9 as h9
from openai import OpenAI
import json

system_prompt = """
Only write python code using pyppeteer to perform the user request. The code will be run dynamically with eval().

The page is already stored as a page variable that you can use.

The following code has already been executed:
import pyppeteer
browser = await pyppeteer.launch()
page = await browser.newPage()

Here is an example on the kind of code you can generate:

# find element with text donate and click it use '*' to support any element
button_with_xpath = await page.xpath('//*[contains(text(), "donate")]')
await button_with_xpath.click()

# set username to 'new value' with type() and evaluating JavaScript dynamically, type() preferred
await page.type('input[name="username"]', 'new value')

# scroll to bottom of page by evaluating arbitrary javascript
await page.evaluate('''() => {
  window.scrollTo(0, document.body.scrollHeight);
}''')

---

At the beginning of the code, use print() to communicate what the code will do.
Only reply with a code block for python code.
"""

def site_use(prompt, current, elements):
  messages = [
    { "role": "system", "content":  system_prompt},
    { "role": "user", "content": f"""
    Page is in URL: {current}.

    The following dictionary contains all the elements in the page and their query selectors to use:

    {json.dumps(elements)}

    User requests: {prompt}
    """ }
  ]
  completion = OpenAI().chat.completions.create(model = "gpt-4", messages = messages)
  content = completion.choices[0].message.content
  extracted = h9.extract(content, language = "*")
  if not extracted or len(extracted) == 0:
    return content
  return extracted
