# Code

Beyond generating text, we can use LLMs to generate code to help us build applications, analyze data, perform complex calculations, and much more. To accomplish this, all we have to do is get the code out of the LLM and run it or create an application with it.

This section will describe some of the possible use cases.

## Computing

The first approach to using code from and LLM is to run it to compute complex answers, we can accomplsih this as follows:

```python
import hal9 as h9
import os
from openai import OpenAI

completion = OpenAI().chat.completions.create(
  model = "gpt-4",
  messages = [
    {"role": "system", "content": "Only reply with plain Python code use no markdown"},
    {"role": "user", "content": input("What would you like me to compute?")},
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
    {"role": "user", "content": input("Ask anything about this CSV")},
  ]
 )

code = h9.extract(completion.choices[0].message.content)
print(exec(code))
```

## Apps

Taking this approach even further, instead of relying on `print` to communicate our answers, we can provide the user an entire interactive application for them to interact with.

We will ask the LLM to generate a web application which we can then run:

```python
import hal9 as h9
from openai import OpenAI

completion = OpenAI().chat.completions.create(
  model = "gpt-4",
  messages = [
    {"role": "system", "content": f"""
        Only reply with plain Python code.
        Write streamlit code to answer the user requirements.
    """},
    {"role": "user", "content": input("What app do you need?")},
  ]
 )

code = h9.extract(completion.choices[0].message.content, "python")

print("Finished creating your app")
h9.save("app.py", code)
```

You can then run the generated application as:

```bash
streamlit run app.py
```
