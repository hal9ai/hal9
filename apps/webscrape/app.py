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
from browser_use.controller.service import Controller
from langchain_openai import ChatOpenAI

response = subprocess.call(["playwright", "install"], stdout = subprocess.DEVNULL, stderr = subprocess.STDOUT)
if response != 0: sys.exit("Couldn't install playwright!")

# openai client setup
api_key = os.environ['HAL9_TOKEN']
server_prod = "https://api.hal9.com/proxy/server=https://api.openai.com/v1/"
server_devel = "https://devel.hal9.com/proxy/server=https://api.openai.com/v1/"
server_local = "http://localhost:5000/proxy/server=https://api.openai.com/v1/"


from openai import OpenAI
client = OpenAI(base_url = server_local, api_key = api_key)

# csv file location
file_path = '.user/staff.csv'
os.makedirs(os.path.dirname(file_path), exist_ok = True)

# browseruse instruction (prompt preamble)
task_def = '''
I want to know who works at a certain company. Concretely, I want to know:
 - the name
 - the team they're in
 - their job title
 - the url of their github repository (if available)
 - the url of their linkedin profile (if available)
want you to gather that information directly from the company's website, for example, from a webpage called "teams".
I want you to report back that information as a list of JSON objects, where every object has the following keys:
 - full_name
 - team
 - job_title
 - github_link
 - linkedin_link
Insert an empty string as a value if a piece of information is not available.

This is the company I want to know their people of: 

'''

controller = Controller()

def append_csv(data):
    if os.path.exists(file_path):
        with open(file_path, 'a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(data)
    else:
        with open(file_path, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(data)

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

# openai prompt
openai_prompt = """
You are given a JSON object that contains information about people that work at a company.
Transform it to csv. 

Start immediately with the header (no additional comments or preambles). The header shall have the following columns:

- company_name
- team
- job_title
- full_name
- github_link
- linkedin_link

All items are plain-text strings. Separate them by commas; don't insert any additional parentheses. Don't use markdown.

Leave empty any information you are not given. Do NOT

Here is an example:

company_name, team, job_title, full_name, github_link, linkedin_link
SomeComp, Data Science, Junior Data Scientist, Julio Álvarez, https://www.github.com/juli, 
SomeComp, Data Science, Team Lead, Julieta Marquez, https://www.github.com/julieta7777, https://www.linkedin.com/in/julieta-marquez-2330ob184/
SomeComp, Legal, Advisor, João Souza, , 
SomeComp, Accounting, , Davide Romano, , https://www.linkedin.com/in/davide-romano-2331ob184/]

"""
async def main():
    # ask browseruse to extract staff information
    user_input = h9.input()
    prompt = task_def + user_input
    agent = Agent(
        browser = browser,
        controller = controller,
        # system_prompt_class = CustomPrompt,
        task = prompt,
        llm = llm,
        save_conversation_path="logs/conversation.json" 
    )
    result = (await run(agent, browser)).final_result()

    # ask openai to generate a csv file from this
    csv_prompt = openai_prompt
    + """

    This is the company it's about:
    """
    + user_input
    + """
    
    And this is the JSON: 
    
    """
    + result

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




