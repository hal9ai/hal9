# import hal9
import hal9 as h9

# import Python packages
import subprocess
import asyncio
import sys
import os
import shutil
import json
import pandas as pd
import re
from io import StringIO


# use OpenAI as LLM
from langchain_openai import ChatOpenAI

# browser-use imports
from browser_use import Agent, Browser, BrowserConfig, SystemPrompt, ActionResult
from browser_use.browser.context import BrowserContextConfig, BrowserContext
from browser_use.agent.service import Agent
from browser_use.controller.service import Controller

response = subprocess.call(["playwright", "install"],
                           stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)
if response != 0:
    sys.exit("Couldn't install playwright!")

csv_file = '.user/people.csv'
os.makedirs(os.path.dirname(csv_file), exist_ok=True)


class CustomPrompt(SystemPrompt):
    def important_rules(self) -> str:
        # Get existing rules from parent class
        existing_rules = super().important_rules()

        # Add your custom rules
        new_rules = """
11. ON SAVING TO CSV:
- When you are tasked to write or append information to a csv file, make use of the function save_to_csv(list_of_json_objects).
- Its argument is to be passed as a list of strings, where each string can be parsed as a json object.
- For scalar property values, put them inside a single-item vector. 
12. DEFAULT TASK:
- Your default task is to extract information on company staff, and append that to a file called '.user/people.csv'.
- The csv file should have a header with column names. When you initially create the csv to append to,
  create it with the following column names:
    - company_name
    - team
    - job_title
    - full_name
    - github_link
    - linkedin_link 
- For each and any of these columns, ONLY use information that is available on the COMPANY website.
  If a piece is not, leave the column EMPTY for that row.
- Make use of the function save_to_csv(list_of_json_objects).
- To this function, pass a list of strings, where each string is a json object representing a single person.
  For property values inside this json object that are scalar values (like strings), put them inside a vector.
  For example, the function call could look like this:
  save_to_csv(
    [
      "{\"company_name\": [\"Hal9\"], \"team\": [\"Science\"], \"job_title\": [\"\"], \"full_name\": [\"Anchit Sadana\"], \"github_link\": [\"\"], \"linkedin_link\": [\"\"]}",
      "{\"company_name\": [\"Hal9\"], \"team\": [\"Science\"], \"job_title\": [\"\"], \"full_name\": [\"Brenda Lambert\"], \"github_link\": [\"\"], \"linkedin_link\": [\"\"]}",
    ]
  )
  Note how the company name \"Hal9\", for example, is surrounded by brackets. Do this for all scalar values.
- The default task is to be completed whenever the USER PROMPT CONTAINS ONE OR MORE COMPANY NAMES. 
  For example, if the user enters 'Hal9, Posit' you should extract information about staff at both Hal9 and Posit,
  and append that to '.user/people.csv'.
- If the user asks you explicitly for anything else, just do what they ask you.
"""

        # Make sure to use this pattern otherwise the existing rules will be lost
        return f'{existing_rules}\n{new_rules}'


controller = Controller()

def replacetext(filename, search_text,replace_text): 
    with open(filename,'r+') as f:
        file = f.read() 
        file = re.sub(search_text, replace_text, file, flags=re.MULTILINE) 
        f.seek(0) 
        f.write(file) 
        f.truncate() 

def save_to_csv(list_of_json_objects: list[str]):
  if not os.path.exists(csv_file):
    with open(csv_file, 'w') as f:
      for _, person in enumerate(list_of_json_objects):
        pd.read_json(StringIO(person)).to_csv(f)
  else:
    with open(csv_file, 'a') as f:
      for _, person in enumerate(list_of_json_objects):
        pd.read_json(StringIO(person)).to_csv(f)

  replacetext(csv_file,"^0?,","")
  return ActionResult(extracted_content = f'Staff information appended to {csv_file}.')

llm = ChatOpenAI(
    model="gpt-4o",
    base_url="https://api.hal9.com/proxy/server=https://api.openai.com/v1/",
    api_key="hal9"
)

browser = Browser(
    config=BrowserConfig(headless=True)
)

config = BrowserContextConfig(
    save_recording_path="./output-files/",
)

context = BrowserContext(browser=browser, config=config)

async def run(agent):
    print("Working!")
    history = await agent.run()
    return history

async def main():
    prompt = h9.input()
    agent = Agent(
        browser_context=context,
        controller=controller,
        system_prompt_class=CustomPrompt,
        task=prompt,
        llm=llm,
        save_conversation_path="logs/conversation.json"
    )
    history = await run(agent)
    await browser.close()

asyncio.run(main())
