from selenium import webdriver
from selenium.webdriver.chrome.options import Options

import shutil
import json

chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")

driver = webdriver.Chrome(options=chrome_options)

url = input()
driver.get(url)

all_text = driver.find_element("xpath", "//*").text
# print(json.dumps(all_text))

driver.save_screenshot("screenshot.png")
shutil.copy("screenshot.png", f"storage/screenshot.png")

driver.quit()
