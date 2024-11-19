from groq import Groq
import os
import hal9 as h9
import json
import openai

from tools.calculator import calculate
from tools.game import build_game
from tools.generic import generic_reply
from tools.hal9 import hal9_reply
from tools.website import build_website
from tools.streamlit import build_streamlit
from tools.image import create_image
from tools.document import document_reply
from tools.csv import csv_reply

MODEL = "llama3-70b-8192"
def run(messages, tools):
  return Groq().chat.completions.create(
    model = MODEL,
    messages = messages,
    temperature = 0,
    seed = 1,
    tools=tools,
    tool_choice="auto")

prompt = input("")
h9.event('prompt', prompt)

messages = h9.load("messages", [])
messages.append({"role": "user", "content": prompt})
h9.save("messages", messages, hidden=True)

all_tools = [
  calculate,
  build_game,
  generic_reply,
  hal9_reply,
  build_website,
  build_streamlit,
  create_image,
  document_reply,
  csv_reply
]

tools = h9.describe(all_tools, model = "llama")

try:
  completion = run(messages, tools)
  h9.complete(completion, messages = messages, tools = all_tools, show = False, model = "llama")
except Exception as e:
  h9.event('error', e)
  one_tool = h9.describe([generic_reply], model = "llama")
  completion = run(messages, one_tool)
  h9.complete(completion, messages = messages, tools = [generic_reply], show = False, model = "llama")

h9.save("messages", messages, hidden=True)
