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
from tools.image_analyzer import image_analyzer

MODEL = "llama3-groq-70b-8192-tool-use-preview"
def run(messages, tools):
  return Groq().chat.completions.create(
    model = MODEL,
    messages = messages,
    temperature = 0,
    seed = 1,
    tools=tools,
    tool_choice = "required",)

prompt = input("")
h9.event('prompt', prompt)

messages = h9.load("messages", [])
if len(messages) <= 0:
  messages.append({"role": "system", "content": "You are Hal9, a helpful and highly capable AI assistant. Your primary responsibility is to analyze user questions and select the most appropriate tool to provide precise, relevant, and actionable responses. Always prioritize using the right tool to ensure efficiency and clarity in your answers."})
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
  csv_reply,
  image_analyzer
]

tools = h9.describe(all_tools, model = "llama")

try:
  completion = run(messages, tools)
  h9.complete(completion, messages = messages, tools = all_tools, show = False, model = "llama")
except Exception as e:
  h9.event('error', str(e))
  one_tool = h9.describe([generic_reply], model = "llama")
  completion = run(messages, one_tool)
  h9.complete(completion, messages = messages, tools = [generic_reply], show = False, model = "llama")

h9.save("messages", messages, hidden=True)
