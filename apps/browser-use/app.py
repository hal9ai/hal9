import hal9 as h9

import subprocess
import asyncio
import sys
import base64 as b64
import os
import shutil

from dotenv import load_dotenv

from langchain_openai import ChatOpenAI

from browser_use import Agent, SystemPrompt, ActionResult
from browser_use.agent.service import Agent
from browser_use.controller.service import Controller

load_dotenv()

response= subprocess.call(["playwright", "install"], stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)
if response != 0: sys.exit("Couldn't install playwright!")

dir = '/tmp/browser-use/'
if os.path.exists(dir):
    shutil.rmtree(dir)
os.makedirs(dir)

class Save_Files(SystemPrompt):
    def important_rules(self) -> str:
        # Get existing rules from parent class
        existing_rules = super().important_rules()

        # Add your custom rules
        new_rules = """
9. IMPORTANT FOR TEXTUAL ANSWERS:
- Make sure you answer a question EXACTLY and COMPLETELY.
  For example, if you are asked to enumerate a list of entities fulfilling some condition, list each and any of them.
  Always do actually provide the information you are asked for - never just post a link instead.

10. IMPORTANT FOR FILES YOU ARE ASKED TO CREATE:
- When you are asked to create a file, save it making use of the save_path you are given.
- You may be asked to create different types of files: text files, screenshots, and recordings.
- Screenshots should be saved as png.
- Recordings should be saved as mp4.
- When asked to save content to a text file, make use of the function save_to_text_file.
- When asked to save a screenshot you have taken, make use of the function save_to_png.
- When asked to save a recording you have produced, make use of the function save_to_mp4.

11. GENERAL RULE REGARDING SUBTASKS:
- When you are given a task involving several subtasks, and one of the subtasks fails, assess whether the other ones are dependent on its success.
  Do this for each subtask individually. If a subtask can be addressed without that prior one having been successfully, ALWAYS execute it.
  In other words, ONLY EVER skip a subtask if its requirements are not given.
"""

        # Make sure to use this pattern otherwise the exiting rules will be lost
        return f'{existing_rules}\n{new_rules}'

controller = Controller()

@controller.action('Save to text file') 
def save_to_text_file(text_content: str, save_path: str = '/tmp/browser-use/multimodel.txt'):
    with open(save_path, 'w') as f: 
        f.write(text_content)
    return ActionResult(extracted_content = f'Text {text_content} written to {save_path}.')

@controller.action('Save screenshot to png') 
def save_to_png(description: str, screenshot: bytes, save_path: str = '/tmp/browser-use/screenshot.png'):
    with open(save_path, 'wb') as f: 
        f.write(screenshot)
    return ActionResult(extracted_content = f'Screenshot for {description} written to {save_path}.')

@controller.action('Save recording to mp4') 
def save_to_mp4(description: str, recording: bytes, save_path: str = '/tmp/browser-use/recording.mp4'):
    with open(save_path, 'wb') as f: 
        f.write(recording)
    return ActionResult(extracted_content = f'Recording for {description} written to {save_path}.')

llm = ChatOpenAI(
    model = "gpt-4o",
    base_url = "https://api.hal9.com/proxy/server=https://api.openai.com/v1/",
    api_key = "hal9"
)

async def run(agent):
    print("\n\n\n\n 🌍🌎🌏n\n") 
    print("Working! \n")
    print("Here you can see what I'm doing. When I'm done, I'll provide the answers to all your questions in order.\n\n\n\n")
    history = await agent.run()
    return history

async def main():
    prompt = h9.input()
    agent = Agent(
        controller = controller,
        system_prompt_class = Save_Files,
        task = prompt,
        llm = llm,
        save_conversation_path="logs/conversation.json" 
    )
    history = await run(agent)

asyncio.run(main())




