import hal9 as h9

import subprocess
import asyncio
import sys
import base64 as b64
import os
import shutil
import numpy as np
import cv2

# grant display access permission needed for screenshot
# tested on Linux - MacOS users will need to find out what works there
response= subprocess.call(["xhost", "+local:"], stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)
if response != 0: sys.exit("Couldn't authorize local users to access screen.")

# import pyautogui

from dotenv import load_dotenv

from langchain_openai import ChatOpenAI

from browser_use import Agent, Browser, SystemPrompt, ActionResult
from browser_use.browser.context import BrowserContextConfig, BrowserContext
from browser_use.agent.service import Agent
from browser_use.controller.service import Controller

load_dotenv()

response= subprocess.call(["playwright", "install"], stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)
if response != 0: sys.exit("Couldn't install playwright!")

browserWidth = 640
browserHeight = 360

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

        # Make sure to use this pattern otherwise the existing rules will be lost
        return f'{existing_rules}\n{new_rules}'

controller = Controller()

@controller.action('Save to text file') 
def save_to_text_file(text_content: str, save_path: str = './output-files/text.txt'):
    with open(save_path, 'w') as f: 
        f.write(text_content)
    return ActionResult(extracted_content = f'Text {text_content} written to {save_path}.')

@controller.action('Create screenshot') 
async def save_to_png(description: str, save_path: str = './output-files/screenshot.png'):
    # pyautogui.screenshot(save_path, region=(0, 0, browserWidth, browserHeight))
    screenshot = await context.take_screenshot()
    # should also work since b64decode also takes ascii text
    decoded_bytes = b64.b64decode(screenshot, validate = True)
    # decoded = b64.b64decode(screenshot.encode(), validate = True)
    # Error executing action save_to_png: 'utf-8' codec can't decode byte 0x89 in position 0: invalid start byte
    #decoded_str = decoded_bytes.decode()

    # debug
    with open('./output-files/screenshot1.png', 'w') as f: 
        f.write(screenshot)
    with open('./output-files/screenshot2.png', 'wb') as f: 
        f.write(decoded_bytes)
    #with open('./output-files/screenshot3.png', 'wb') as f: 
    #    f.write(decoded_str)

    #iVBORw0KGgoAAAANSUhEUgAAAoAAAAFoCAIAAABIUN0GAAAAAXNSR0IArs4c6QAABZBJREFUeJzt1TEBACAMwDDAv+fhgh4kCvp1z8wCAN46dQAA/MiAASBgwAAQMGAACBgwAAQMGAACBgwAAQMGgIABA0DAgAEgYMAAEDBgAAgYMAAEDBgAAgYMAAEDBoCAAQNAwIABIGDAABAwYAAIGDAABAwYAAIGDAABAwaAgAEDQMCAASBgwAAQMGAACBgwAAQMGAACBgwAAQMGgIABA0DAgAEgYMAAEDBgAAgYMAAEDBgAAgYMAAEDBoCAAQNAwIABIGDAABAwYAAIGDAABAwYAAIGDAABAwaAgAEDQMCAASBgwAAQMGAACBgwAAQMGAACBgwAAQMGgIABA0DAgAEgYMAAEDBgAAgYMAAEDBgAAgYMAAEDBoCAAQNAwIABIGDAABAwYAAIGDAABAwYAAIGDAABAwaAgAEDQMCAASBgwAAQMGAACBgwAAQMGAACBgwAAQMGgIABA0DAgAEgYMAAEDBgAAgYMAAEDBgAAgYMAAEDBoCAAQNAwIABIGDAABAwYAAIGDAABAwYAAIGDAABAwaAgAEDQMCAASBgwAAQMGAACBgwAAQMGAACBgwAAQMGgIABA0DAgAEgYMAAEDBgAAgYMAAEDBgAAgYMAAEDBoCAAQNAwIABIGDAABAwYAAIGDAABAwYAAIGDAABAwaAgAEDQMCAASBgwAAQMGAACBgwAAQMGAACBgwAAQMGgIABA0DAgAEgYMAAEDBgAAgYMAAEDBgAAgYMAAEDBoCAAQNAwIABIGDAABAwYAAIGDAABAwYAAIGDAABAwaAgAEDQMCAASBgwAAQMGAACBgwAAQMGAACBgwAAQMGgIABA0DAgAEgYMAAEDBgAAgYMAAEDBgAAgYMAAEDBoCAAQNAwIABIGDAABAwYAAIGDAABAwYAAIGDAABAwaAgAEDQMCAASBgwAAQMGAACBgwAAQMGAACBgwAAQMGgIABA0DAgAEgYMAAEDBgAAgYMAAEDBgAAgYMAAEDBoCAAQNAwIABIGDAABAwYAAIGDAABAwYAAIGDAABAwaAgAEDQMCAASBgwAAQMGAACBgwAAQMGAACBgwAAQMGgIABA0DAgAEgYMAAEDBgAAgYMAAEDBgAAgYMAAEDBoCAAQNAwIABIGDAABAwYAAIGDAABAwYAAIGDAABAwaAgAEDQMCAASBgwAAQMGAACBgwAAQMGAACBgwAAQMGgIABA0DAgAEgYMAAEDBgAAgYMAAEDBgAAgYMAAEDBoCAAQNAwIABIGDAABAwYAAIGDAABAwYAAIGDAABAwaAgAEDQMCAASBgwAAQMGAACBgwAAQMGAACBgwAAQMGgIABA0DAgAEgYMAAEDBgAAgYMAAEDBgAAgYMAAEDBoCAAQNAwIABIGDAABAwYAAIGDAABAwYAAIGDAABAwaAgAEDQMCAASBgwAAQMGAACBgwAAQMGAACBgwAAQMGgIABA0DAgAEgYMAAEDBgAAgYMAAEDBgAAgYMAAEDBoCAAQNAwIABIGDAABAwYAAIGDAABAwYAAIGDAABAwaAgAEDQMCAASBgwAAQMGAACBgwAAQMGAACBgwAAQMGgIABA0DAgAEgYMAAEDBgAAgYMAAEDBgAAgYMAAEDBoCAAQNAwIABIGDAABAwYAAIGDAABAwYAAIGDAABAwaAgAEDQMCAASBgwAAQMGAACBgwAAQMGAACBgwAAQMGgIABA0DAgAEgYMAAEDBgAAgYMAAEDBgAAgYMAAEDBoCAAQNAwIABIGDAABAwYAAIGDAABAwYAAIGDAABAwaAgAEDQMCAASBgwAAQMGAACBgwAAQMGAACBgwAAQMGgIABA0DAgAEgYMAAEDBgAAgYMAAEDBgAAgYMAAEDBoCAAQNAwIABIGDAABAwYAAIGDAABAwYAAIGDACBC6nKBc0bYHDkAAAAAElFTkSuQmCC
    print(screenshot)
    print()
    #b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x02\x80\x00\x00\x01h\x08\x02\x00\x00\x00HP\xdd\x06\x00\x00\x00\x01sRGB\x00\xae\xce\x1c\xe9\x00\x00\x05\x90IDATx\x9c\xed\xd51\x01\x00 \x0c\xc00\xc0\xbf\xe7\xe1\x82\x1e$\n\xfau\xcf\xcc\x02\x00\xde:u\x00\x00\xfc\xc8\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x01\x03\x06\x80\x80\x01\x03@\xc0\x80\x01 \xc0\x00\x100\x00\x08\x180\x00\x04\x0c\x18\x00\x02\x06\x0c\x00\x81\x0b\xa9\xca\x05\xcd\x1bp\xe4\x00\x00\x00\x00IEND\xaeB\x82'
    print(decoded_bytes)
    print()
    #print(decoded_str)

    return ActionResult(extracted_content = f'Screenshot for {description} written to {save_path}.')

@controller.action('Create recording') 
async def save_to_avi(description: str, save_path: str = './output-files/recording.avi'):
    resolution = (1920, 1080)
    codec = cv2.VideoWriter_fourcc(*"XVID")
    fps = 10.0 

    out = cv2.VideoWriter(save_path, codec, fps, resolution)
    cv2.namedWindow("Live", cv2.WINDOW_NORMAL)
    cv2.resizeWindow("Live", 480, 270)

    remaining =  1 * int(fps)
    while (remaining > 0):
        # img = pyautogui.screenshot(region=(0, 0, browserWidth, browserHeight))
        screenshot = await context.take_screenshot()
        decoded = b64.b64decode('utf-8')
        frame = np.array(decoded)
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

""" browser = Browser(
	config=BrowserConfig(
		# for available options see
        # https://github.com/browser-use/browser-use/blob/5d1197e5d3b8b7d191aac638b052007882504040/browser_use/browser/browser.py#L178
        extra_chromium_args = [f'--window-position=0,0, --window-size={browserWidth},{browserHeight}'],
	)
) """

config = BrowserContextConfig(
    browser_window_size = {'width': browserWidth, 'height': browserHeight},
    save_recording_path = "./output-files/",
)

browser = Browser()
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
        system_prompt_class = Save_Files,
        task = prompt,
        llm = llm,
        save_conversation_path="logs/conversation.json" 
    )
    history = await run(agent)
    await browser.close()

asyncio.run(main())




