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

# browser-use imports and setup
from browser_use import Agent, Browser, BrowserConfig, SystemPrompt, ActionResult
from browser_use.browser.context import BrowserContextConfig, BrowserContext
from browser_use.agent.service import Agent
from browser_use.controller.service import Controller
from langchain_openai import ChatOpenAI

response = subprocess.call(["playwright", "install"], stdout = subprocess.DEVNULL, stderr = subprocess.STDOUT)
if response != 0: sys.exit("Couldn't install playwright!")

# openai client setup
from openai import OpenAI
client = OpenAI(base_url="https://api.hal9.com/proxy/server=https://api.openai.com/v1/", api_key = os.environ['HAL9_TOKEN'])

# csv file location
dir = '.user'
if (os.path.exists(dir) == False):
    os.makedirs(dir)
csv_file = "staff.csv"

# custom configure browseruse
class CustomPrompt(SystemPrompt):
    def important_rules(self) -> str:
        # Get existing rules from parent class
        existing_rules = super().important_rules()

        # Add your custom rules
        new_rules = """
11. DEFAULT TASK:
- Your default task is to extract information on company staff.
- ONLY use the company's website to obtain employee information,
  NOT any other web pages the company or its employees might appear on.
  E.g., do NOT!!! look for GitHub contributors to a company's organization instead!
  We are interested in the following pieces of information:
    - company name
    - team/department
    - job title
    - full name
    - link to GitHub repository (only if mentioned on the page)
    - link to LinkedIn profile (only if mentioned on the page)
    - For each and any of these items, only use information that is available directly on the company website. If a piece is not, set it to an empty string.
12. RETURN FORMAT
- The extracted information shall be passed back as a list of JSON objects. Here is an example:

13. OVERALL WORKFLOW
- The DEFAULT TASK is to be completed whenever the user prompt contains one or more company names. 
  For example, if the user enters 'Hal9, Posit' you should extract information about staff at Hal9 and Posit.
- If the user asks you explicitly for something else, just do what you are asked to do.
"""

        # Make sure to use this pattern otherwise the existing rules will be lost
        return f'{existing_rules}\n{new_rules}'

controller = Controller()

def append_csv(data):
    # tbd create or append to file

llm = ChatOpenAI(
    model = "gpt-4o",
    base_url = "https://api.hal9.com/proxy/server=https://api.openai.com/v1/",
    api_key = os.environ['HAL9_TOKEN']
)

browser = Browser(
    config = BrowserConfig(headless = True)
)

async def run(agent, browser):
    print("Working!")
    history = await agent.run()
    await browser.close()
    return history

# openai task
openai_prompt = "tbd"  

async def main():
    # ask browseruse to extract staff information
    prompt = h9.input()
    agent = Agent(
        browser = browser,
        controller = controller,
        system_prompt_class = CustomPrompt,
        task = prompt,
        llm = llm,
        save_conversation_path="logs/conversation.json" 
    )
    result = run(agent, browser).final_result()

    # ask openai to generate a csv file from this
    csv_prompt = openai_prompt + "\n" + result

    messages = h9.load("messages", [])
    messages.append({"role": "user", "content": csv_prompt})
    completion = client.chat.completions.create(model = "o1-preview", messages = messages, stream = True)
    h9.save("messages", messages, hidden = True) # needed???
    response = ""
    for chunk in completion:
        if chunk.choices and chunk.choices[0].delta and chunk.choices[0].delta.content:
            content = chunk.choices[0].delta.content
            print(content, end="")
            response += content

    # append to existing csv file
    append_csv(response)
    print(os.path.join("Staff information saved at: ", dir, csv_file))

asyncio.run(main())




