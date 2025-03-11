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
from browser_use.browser.context import BrowserContext
from browser_use.agent.service import Agent

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
11. DEFAULT TASK:
  - Your default task is to extract information on company staff.
  - Return that information as a JSON object. 
  - We are interested in the following items 
    - company name (top-level JSON key)
    - full name (second-level JSON key)
    - team (third-level JSON key)
    - job title (third-level JSON key)
    - Github link (third-level JSON key; only if available, leave empty otherwise)
    - LinkedIn link (third-level JSON key; only if available, leave empty otherwise)
  - The JSON object returned should look like this:
  {
    "company123":
      {
        "Ana Ramírez":
          {
            "team": "teamZ",
            "job_title": "pos77",
            "github_link": "http://github.com/ana123",
            "linkedin_link": "" 
          },
        "Julieta Álvarez":
          {
            "team": "teamH",
            "job_title": "pos11",
            "github_link": "http://github.com/ja7777",
            "linkedin_link": "https://www.linkedin.com/in/julietaalvarez" 
          },
        "Julieta Álvarez":
          {
            "team": "teamA",
            "job_title": "pos11",
            "github_link": "http://github.com/ja8888",
            "linkedin_link": ""
          }     
      },
    "company789":
        {
          "Santiago Botero":
            {
              "team": "teamY",
              "job_title": "pos1",
              "github_link": "http://github.com/botero11111",
              "linkedin_link": "" 
            }
        }
    }
- For each and any of these columns, ONLY use information that is available on the company's website.
  If a piece is not, leave the column EMPTY for that row.
- The default task is to be completed whenever the USER PROMPT CONTAINS ONE OR MORE COMPANY NAMES. 
  For example, if the user enters 'Hal9, Posit' you should extract information about staff at both Hal9 and Posit.
- If the user asks you explicitly for anything else, just do what they ask you.
"""

        # Make sure to use this pattern otherwise the existing rules will be lost
        return f'{existing_rules}\n{new_rules}'

def replacetext(filename, search_text,replace_text): 
    with open(filename,'r+') as f:
        file = f.read() 
        file = re.sub(search_text, replace_text, file, flags=re.MULTILINE) 
        f.seek(0) 
        f.write(file) 
        f.truncate() 

llm = ChatOpenAI(
    model="gpt-4o",
    base_url="https://api.hal9.com/proxy/server=https://api.openai.com/v1/",
    api_key="hal9"
)

browser = Browser(
    config=BrowserConfig(headless=True)
)

context = BrowserContext(browser=browser)

async def run(agent):
    print("Working!")
    history = await agent.run()
    return history.final_result()

async def main():
    prompt = h9.input()
    agent = Agent(
        browser_context=context,
        system_prompt_class=CustomPrompt,
        task=prompt,
        llm=llm,
        save_conversation_path="logs/conversation.json"
    )
    result = await run(agent)
    print(result.extracted_content)
    await browser.close()

asyncio.run(main())
