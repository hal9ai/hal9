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
- When you are tasked to write or append information to a csv file, make use of the function save_to_csv.
- All columns must contain a simple piece of information, not ever a composition (e.g., no nested data types, no JSON objects!)
12. DEFAULT TASK:
- Your default task is to extract information on company staff, and write/append that to a file called '.user/people.csv'.
- Important: ONLY use the company's website to obtain employee information,
  NOT any other web pages the company or its employees might appear on.
  E.g., do NOT!!! look for GitHub contributors to a company's organization instead!
- The csv file should have a header with column names. When you initially create the csv to append to,
  create it with the following column names:
    - company name
    - team
    - job title
    - full name
    - link to GitHub repository
    - link to LinkedIn profile
- For each and any of these columns, ONLY use information that is available on the COMPANY website.
  If a piece is not, leave the column EMPTY for that row.
- The default task is to be completed whenever the USER PROMPT CONTAINS ONE OR MORE COMPANY NAMES. 
  For example, if the user enters 'Hal9, Posit' you should extract information about staff at both Hal9 and Posit,
  and append that to '.user/people.csv'.
- If the user asks you explicitly for anything else, just do what they ask you.
"""

        # Make sure to use this pattern otherwise the existing rules will be lost
        return f'{existing_rules}\n{new_rules}'


controller = Controller()


@controller.action('On saving information to csv')
def save_to_csv(json: str):
  if not os.path.exists(csv_file):
    with open(csv_file, 'w') as f:
      pd.read_json(json).to_csv(f)
  else:
    with open(csv_file, 'a') as f:
      pd.read_json(json).to_csv(f)

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
