---
sidebar_position: 3
---

# Code Interpreter

Beyond generating text, we can use LLMs to generate code to help us build applications, analyze data, perform complex calculations, and much more. To accomplish this, all we have to do is get the code out of the LLM and run it or create an application with it.

This section will describe some of the possible use cases.

## Computing

The first approach to using code from and LLM is to run it to compute complex answers, we can accomplish this as follows:

```python
import hal9 as h9
import os
from openai import OpenAI

completion = OpenAI().chat.completions.create(
  model = "gpt-4",
  messages = [
    {"role": "system", "content": "Only reply with plain Python code use no markdown"},
    {"role": "user", "content": input()},
  ]
 )

code = h9.extract(completion.choices[0].message.content)
print(exec(code))
```

LLMs are not really that good at doing math; however, with the help of this code interpreter, we can run complex calculations that are impossible to run using only a LLM

## Data

We can take this a step further and make use of external data sources to compute even more complex questions. Let's use an spreadsheet file in CSV format to extract the headers, ask the LLM to compute a query that answers the user question, and run the results:

```python
import hal9 as h9
import os
from openai import OpenAI
import pandas as pd

url = ""
csv = pd.read_csv(url)
headers = csv.head(1)

completion = OpenAI().chat.completions.create(
  model = "gpt-4",
  messages = [
    {"role": "system", "content": f"""
        Only reply with plain Python code, use no markdown. Download the
        csv in {url} and answer user questions. The CSV contains the 
        following headers:

        {headers}
    """},
    {"role": "user", "content": input()},
  ]
 )

code = h9.extract(completion.choices[0].message.content)
print(exec(code))
```

## Web Apps

Taking this approach even further, instead of relying on `print` to communicate our answers, we can provide the user an entire web application for them to interact with.

We will ask the LLM to generate a web application:

```python
import openai
import os
import hal9 as h9
from openai import OpenAI

messages = h9.load("messages", [{ "role": "system", "content": """
  Always reply with a single page HTML markdown block (which can use JavaScript,
  CSS, etc) that fulfills the user request
""" }])

messages.append({"role": "user", "content": input()})

completion = OpenAI().chat.completions.create(
  model = "gpt-4",
  messages = messages,
  temperature = 0,
  seed= 1
)

response = completion.choices[0].message.content
messages.append({"role": "assistant", "content": response})
h9.save("messages", messages, hidden=True)

code = h9.extract(response, "html")
h9.save("app.html", code)
```

## Analytics

Instead of building web applications, you can build data analytics apps that query databases and display charts as follows:

```python
import hal9 as h9
from openai import OpenAI

messages = h9.load("messages", [{ "role": "system", "content": """
  Only reply with plain Python code.
  Write streamlit code to answer the user requirements.
""" }])

messages.append({"role": "user", "content": input()})

completion = OpenAI().chat.completions.create(
  model = "gpt-4",
  messages = messages
)

response = completion.choices[0].message.content
messages.append({"role": "assistant", "content": response})
h9.save("messages", messages, hidden=True)

code = h9.extract(response, "python")
h9.save("app.py", code)
```

Hal9 will embed and run this application automatically for you. But if you are working in your own computer you can run the generated application as follows:

```bash
streamlit run app.py
```
