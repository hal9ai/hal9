import hal9 as h9

import subprocess
import asyncio
import sys
import base64 as b64
import os
import shutil
import numpy as np
import cv2

# 
# tested on Linux - MacOS users will need to find out what works there
response= subprocess.call(["xhost", "+local:"], stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)
if response != 0: sys.exit("Couldn't authorize local users to access screen.")

import pyautogui

from dotenv import load_dotenv

from langchain_openai import ChatOpenAI

from browser_use import Agent, Browser, SystemPrompt, ActionResult
from browser_use.agent.service import Agent
from browser_use.controller.service import Controller
from browser_use.browser.context import BrowserContextConfig, BrowserContext

load_dotenv()

response= subprocess.call(["playwright", "install"], stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)
if response != 0: sys.exit("Couldn't install playwright!")

browserWidth = 1280
browserHeight = 1100

dir = './output-files/'
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
- Screenshots should be saved as .png.
- Recordings should be saved as .avi.
- When asked to save content to a text file, make use of the function save_to_text_file.
- When asked to create a screenshot, make use of the function create_png.
- When asked to create a screen recording, make use of the function create_avi.

11. GENERAL RULE REGARDING SUBTASKS:
- When you are given a task involving several subtasks, and one of the subtasks fails, assess whether the other ones are dependent on its success.
  Do this for each subtask individually. If a subtask can be addressed without that prior one having been successfully, ALWAYS execute it.
  In other words, ONLY EVER skip a subtask if its requirements are not given.
"""

        # Make sure to use this pattern otherwise the exiting rules will be lost
        return f'{existing_rules}\n{new_rules}'

controller = Controller()

@controller.action('Save to text file') 
def save_to_text_file(text_content: str, save_path: str = './output-files/text.txt'):
    with open(save_path, 'w') as f: 
        f.write(text_content)
    return ActionResult(extracted_content = f'Text {text_content} written to {save_path}.')

@controller.action('Create screenshot') 
def save_to_png(description: str, save_path: str = './output-files/screenshot.png'):
    # matches --window-position=0,0 from browser config
    pyautogui.screenshot(save_path, region=(0, 0, browserWidth, browserHeight))
    return ActionResult(extracted_content = f'Screenshot for {description} written to {save_path}.')

@controller.action('Create recording') 
def save_to_avi(description: str, save_path: str = './output-files/recording.avi'):
    resolution = (1920, 1080)
    codec = cv2.VideoWriter_fourcc(*"XVID")
    fps = 10.0 

    out = cv2.VideoWriter(save_path, codec, fps, resolution)
    cv2.namedWindow("Live", cv2.WINDOW_NORMAL)
    cv2.resizeWindow("Live", 480, 270)

    remaining =  1 * int(fps)
    while (remaining > 0):
        img = pyautogui.screenshot(region=(0, 0, browserWidth, browserHeight))
        frame = np.array(img)
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        out.write(frame)
        remaining -= 1
    
    out.release()
    cv2.destroyAllWindows()
    return ActionResult(extracted_content = f'Recording for {description} written to {save_path}.')

llm = ChatOpenAI(
    model = "gpt-4o",
    base_url = "https://api.hal9.com/proxy/server=https://api.openai.com/v1/",
    api_key = "hal9"
)

config = BrowserContextConfig(
    browser_window_size = {'width': browserWidth, 'height': browserHeight},
    # for available options see
    # https://github.com/browser-use/browser-use/blob/5d1197e5d3b8b7d191aac638b052007882504040/browser_use/browser/browser.py#L178
    extra_chromium_args = ['--window-position=0,0'],
)

browser = Browser()
context = BrowserContext(browser=browser, config=config)


async def run(agent):
    print("🌍🌎🌏") 
    print("Working!")
    print("Here you can see what I'm doing. When I'm done, I'll provide the answers to all your questions in order.")
    history = await agent.run()
    return history

async def main():
    prompt = h9.input()
    agent = Agent(
        controller = controller,
        system_prompt_class = Save_Files,
        browser_context=context,
        task = prompt,
        llm = llm,
        save_conversation_path="logs/conversation.json" 
    )
    history = await run(agent)

asyncio.run(main())




