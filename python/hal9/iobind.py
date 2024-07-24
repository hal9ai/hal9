import json
import os
from pathlib import Path
from hal9.urls import url_contents
import pickle
import tempfile

def add_extension(name, contents):
  if not extension:
    if isinstance(contents, dict) or isinstance(contents, list) or isinstance(contents, str):
      path = path + ".json"
    else:
      path = path + ".pkl"
  return path

def find_extension(file_path):
  if Path(file_path + '.json').exists() or get_hidden(Path(file_path + '.json')).exists():
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
        contents = pickle.load(file)
    else:
      with open(file_path, 'rb') as file:
        contents = file.read()
  else:
    contents = default

  return contents

def save(name, contents = None, hidden = False, files = None):
  if hidden and not name.startswith('.'):
    name = "." + name

  if files is None:
    target_path = '.'
    files = { name: contents }
  else:
    target_path = tempfile.mkdtemp()

  for file_name, contents in files.items():
    file_name = add_extension(file_name, contents)
    file_path = Path(target_path) / file_name
    extension = get_extension(file_name)

    if (extension == "json"):
      contents = json.dumps(contents, indent=2)
      file_path.write_text(contents)
    
    if isinstance(contents, str):
      file_path.write_text(contents)
    else:
      if extension == "json":
        with open(file_path, 'wb') as file:
          pickle.dump(contents, file)
      else:
        raise f"Don't know how to save {extension}"

  if target_path != '.':
    asset_definition = json.dumps({
      "name": name
      "files": files.keys()
    }, indent=2)
    Path(name + '.asset').write_text(contents)

original_input = input
def input(prompt = "", extract = True):
  text = original_input(prompt)
  if extract:
    text = url_contents(text)
  return text
