# import hal9
import hal9 as h9

# import Python packages
import subprocess
import asyncio
import sys
import os
import csv

# browser-use imports and setup
from browser_use import Agent, Browser, BrowserConfig, SystemPrompt, ActionResult
from browser_use.browser.context import BrowserContextConfig, BrowserContext
from browser_use.agent.service import Agent
from langchain_openai import ChatOpenAI

# import openai
from openai import OpenAI

response = subprocess.call(["playwright", "install"], stdout = subprocess.DEVNULL, stderr = subprocess.STDOUT)
if response != 0: sys.exit("Couldn't install playwright!")

# utility functions and variables
__location__ = os.path.realpath(
    os.path.join(os.getcwd(), os.path.dirname(__file__)))
EOL = "eol"

file_path = '.user/staff.csv'
os.makedirs(os.path.dirname(file_path), exist_ok = True)

def append_csv(data):
    data = data.split(EOL)
    if os.path.exists(file_path):
        with open(file_path, 'a', newline='') as file:
            writer = csv.writer(file)  
            writer.writerow(data)
    else:
        with open(file_path, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(data)

# browser-use config
with open(os.path.join(__location__, 'browseruse_prompt.md'), 'r') as f:
    browseruse_prompt = f.read()

# openai config
api_key = os.environ['HAL9_TOKEN']
server_prod = "https://api.hal9.com/proxy/server=https://api.openai.com/v1/"
server_devel = "https://devel.hal9.com/proxy/server=https://api.openai.com/v1/"
server_local = "http://localhost:5000/proxy/server=https://api.openai.com/v1/"

with open(os.path.join(__location__, 'openai_prompt.md'), 'r') as f:
    openai_prompt = f.read()

client = OpenAI(base_url = server_local, api_key = api_key)

llm = ChatOpenAI(
    model = "gpt-4o",
    base_url = server_local,
    api_key = api_key
)

browser = Browser(
    config = BrowserConfig(headless = True)
)

async def run(agent, browser):
    print("Working!")
    history = await agent.run()
    await browser.close()
    return history

async def main():
    # ask browseruse to extract staff information
    user_input = h9.input()
    prompt = browseruse_prompt + user_input
    agent = Agent(
        browser = browser,
        task = prompt,
        llm = llm,
        save_conversation_path="logs/conversation.json" 
    )
    result = (await run(agent, browser)).final_result()

    # ask openai to generate a csv file from this
    # csv_prompt = openai_prompt + "This is the company it's about: " + user_input + ". And this is the JSON: " + result  + ". And this is the value to be written into the EOL column: " + EOL
    csv_prompt = openai_prompt +\
        "This is the company it's about: " + user_input +\
             ". And this is the JSON: " + result  +\
                 ". And this is the value to be written into the EOL column: " + EOL

    messages = h9.load("messages", [])
    messages.append({"role": "user", "content": csv_prompt})
    completion = client.chat.completions.create(model = "o1-preview", messages = messages, stream = True)
    h9.save("messages", messages, hidden = True)
    response = ""
    for chunk in completion:
        if chunk.choices and chunk.choices[0].delta and chunk.choices[0].delta.content:
            content = chunk.choices[0].delta.content
            print(content, end="")
            response += content
    # append to existing csv file
    append_csv(response)
    print(os.path.join("Staff information saved at: " + file_path))

asyncio.run(main())




