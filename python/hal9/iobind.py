import json
import os
from pathlib import Path
from hal9.urls import url_contents
import pickle

def add_extension(path, contents):
  _, extension = os.path.splitext(path)
  if not extension:
    if isinstance(contents, dict) or isinstance(contents, list):
      path = path + ".json"
    else:
      path = path + ".pkl"
  return Path(path)

def find_extension(file_path):
  json_hidden = get_hidden(Path(file_path + '.json'))
  if Path(file_path + '.json').exists() or Path(json_hidden).exists():
    return Path(file_path + '.json')
  return Path(file_path + '.pkl')

def get_hidden(file_path):
    directory = file_path.parent
    file_name = file_path.name
    hidden_file_name = "." + file_name
    hidden_path = directory / hidden_file_name
    if hidden_path.exists():
        return hidden_path
    return file_path

def add_hidden(file_path, hidden):
  if hidden:
    directory = file_path.parent
    file_name = file_path.name
    hidden_file_name = "." + file_name
    file_path = directory / hidden_file_name
  return file_path

def get_extension(file_path):
  _, extension = os.path.splitext(file_path)
  return extension.lstrip('.')

def load(name, default):
  file_path = find_extension(name)
  file_path = get_hidden(file_path)

  extension = get_extension(file_path)

  if not extension:
    extension = "pkl"

  if file_path.exists():
    if (extension == "json"):
      contents = json.loads(file_path.read_text())
    elif (extension == "pkl"):
      with open(file_path, 'rb') as file:
        contents = pickle.load(file_path)
    else:
      with open(file_path, 'rb') as file:
        contents = file.read()
  else:
    contents = default

  return contents

def save(name, contents, hidden = False):
  file_path = add_extension(name, contents)
  file_path = add_hidden(file_path, hidden)

  extension = get_extension(file_path)
  if (extension == "json"):
    contents = json.dumps(contents, indent=2)
    file_path.write_text(contents)
  
  if isinstance(contents, str):
    file_path.write_text(contents)
  elif isinstance(contents, bytes):
    file_path.write_bytes(contents)
  else:
    with open(file_path, 'wb') as file:
      pickle.dump(contents, file)

original_input = input
def input(prompt = "", extract = True):
  text = original_input(prompt)
  if extract:
    text = url_contents(text)
  return text
