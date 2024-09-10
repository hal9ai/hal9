from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import json
import hal9 as h9
import shutil
import time

from sitefind import site_find
from siteuse import site_use

def take_screenshot():
  time.sleep(2)
  driver.save_screenshot("screenshot.png")
  shutil.copy("screenshot.png", f"storage/screenshot-{int(time.time())}.png")

chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
custom_user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
chrome_options.add_argument(f"user-agent={custom_user_agent}")

driver = webdriver.Chrome(options=chrome_options)

prompt = h9.input()
site = site_find(prompt)
driver.get(site)

for i in range(1, 5):
  code = ""
  try:
    code = site_use(prompt, driver.current_url)
    exec(code)
    take_screenshot()
  except Exception as e:
    print(f"Failed to use browser, details follow.\n```{code}```\n\n```\n{e}```\n")

  prompt = h9.input("Taking screenshot, what next?")

driver.quit()

print("Five tasks completed, this browser session is restarting.")
print("🌐 I can browse the web, how can I help?")
