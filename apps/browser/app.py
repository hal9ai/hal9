import pyppeteer
import asyncio

import json
import hal9 as h9
import shutil
import time
import psutil

from sitefind import site_find
from siteuse import site_use

async def take_screenshot(page, step):
  await asyncio.sleep(2)
  await page.screenshot({'path': "screenshot.png"})
  shutil.copy("screenshot.png", f"storage/screenshot-{int(time.time())}.png")

def wrap_in_async_function(code):
  indented_code = "\n".join("    " + line for line in code.splitlines() if line.strip())  # Indent each line by 4 spaces
  wrapped_code = f"async def dynamic_async_func(page):\n{indented_code}"
  return wrapped_code

async def main():
  custom_user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
  browser = await pyppeteer.launch()
  page = await browser.newPage()

  await page.setUserAgent(custom_user_agent)

  # Get the input and find the site
  prompt = h9.input()
  site = site_find(prompt)

  print(f"Navigating to {site}")
  await page.goto(site)

  for i in range(1, 5):
    code = "# No code generated"
    try:
      code = site_use(prompt, page.url)
      wrapped_code = wrap_in_async_function(code)
      local_vars = {}
      exec(wrapped_code, {}, local_vars)
      await local_vars['dynamic_async_func'](page)

      await take_screenshot(page, i)
    except Exception as e:
      print(f"Failed to use browser, details follow.\n```\n{code}\n```\n\n```\n{e}\n```\n")
      print(f"Available Memory: {(psutil.virtual_memory().available/ (1024 ** 2)):.2f} MB")

    prompt = h9.input(f"Taking screenshot for step {i}/5, what next?")

  await browser.close()

  print("Five tasks completed, this browser session is restarting.")
  print("🌐 I can browse the web, how can I help?")

asyncio.get_event_loop().run_until_complete(main())
