# import hal9
import hal9 as h9

# import Python packages
import subprocess
import asyncio
import sys
import os
import shutil

# use OpenAI as LLM
from langchain_openai import ChatOpenAI

# browser-use imports
from browser_use import Agent, Browser, BrowserConfig, SystemPrompt, ActionResult
from browser_use.browser.context import BrowserContextConfig, BrowserContext
from browser_use.agent.service import Agent
from browser_use.controller.service import Controller

response = subprocess.call(["playwright", "install"], stdout = subprocess.DEVNULL, stderr = subprocess.STDOUT)
if response != 0: sys.exit("Couldn't install playwright!")

dir = './output-files/'
if os.path.exists(dir):
    shutil.rmtree(dir)
os.makedirs(dir)

class CustomPrompt(SystemPrompt):
    def important_rules(self) -> str:
        # Get existing rules from parent class
        existing_rules = super().important_rules()

        # Add your custom rules
        new_rules = """
9. GENERAL RULE REGARDING SUBTASKS:
- When you are given a task involving several subtasks, and one of the subtasks fails, assess whether the other ones are dependent on its success.
  Do this for each subtask individually. If a subtask can be addressed without that prior one having been successfully, ALWAYS execute it.
  In other words, ONLY EVER skip a subtask if its requirements are not given.
"""

        # Make sure to use this pattern otherwise the existing rules will be lost
        return f'{existing_rules}\n{new_rules}'

controller = Controller()

@controller.action('Save to text file') 
def save_to_text_file(text_content: str, save_path: str = './output-files/text.txt'):
    with open(save_path, 'w') as f: 
        f.write(text_content)
    return ActionResult(extracted_content = f'Text {text_content} written to {save_path}.')

llm = ChatOpenAI(
    model = "gpt-4o",
    base_url = "https://api.hal9.com/proxy/server=https://api.openai.com/v1/",
    api_key = os.environ['HAL9_TOKEN']
)

browser = Browser(
    config = BrowserConfig(headless =  True)
)

config = BrowserContextConfig(
    save_recording_path = "./output-files/",
)

context = BrowserContext(browser = browser, config = config)

async def run(agent):
    print("🌍🌎🌏") 
    print("Working!")
    print("Here you can see what I'm doing. When I'm done, I'll provide the answers to all your questions in order.")
    history = await agent.run()
    return history

async def main():
    prompt = h9.input()
    agent = Agent(
        browser_context = context,
        controller = controller,
        system_prompt_class = CustomPrompt,
        task = prompt,
        llm = llm,
        save_conversation_path="logs/conversation.json" 
    )
    history = await run(agent)
    await browser.close()

asyncio.run(main())




