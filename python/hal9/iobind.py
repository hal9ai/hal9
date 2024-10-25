import json
import os
from pathlib import Path
from hal9.urls import url_contents
import pickle
import tempfile
import sys
import shutil

input_original = input
input_first = True

def get_extension(file_path):
  _, extension = os.path.splitext(file_path)
  return extension.lstrip('.')

def add_extension(name, contents):
  extension = get_extension(name)

  if not extension:
    contents_type = str(type(contents))
    if isinstance(contents, dict) or isinstance(contents, list) or isinstance(contents, str):
      name = name + ".json"
    elif contents_type == "<class 'PIL.Image.Image'>":
      name = name + ".jpg"
    else:
      name = name + ".pkl"
  return name

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

def load(name, default):
  file_path = ".storage/" + name
  file_path = find_extension(file_path)
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
  if not isinstance(name, str):
    raise Exception(f"The name parameter in save() must be a string, got {str(type(name))}")

  if hidden and not name.startswith('.'):
    name = "." + name

  if files is None:
    target_path = './.storage'
    files = { name: contents }
  else:
    target_path = tempfile.mkdtemp()
    if not contents is None:
      files[name] = contents

  asset_files = []
  for file_name, contents in files.items():
    file_name = add_extension(file_name, contents)
    file_path = Path(target_path) / file_name
    contents_type = str(type(contents))

    if file_path.parent != Path('.'):
      file_path.parent.mkdir(parents=True, exist_ok=True)

    extension = get_extension(file_name)
    asset_files.append(file_path)

    if (extension == "json"):
      contents = json.dumps(contents, indent=2)
      file_path.write_text(contents)
    
    if isinstance(contents, str):
      file_path.write_text(contents)
    elif contents is None:
      raise Exception(f"Can't save empty contents for {name}")
    else:
      if extension == "pkl":
        with open(file_path, 'wb') as file:
          pickle.dump(contents, file)
      elif extension == "jpg":
        temp_path = Path(tempfile.mkdtemp()) / name
        contents.save(temp_path, format="JPEG")
        shutil.copy(temp_path, file_path)
      else:
        raise Exception(f"Don't know how to save {extension} for {contents_type}")

  if target_path != './.storage':
    asset_definition = json.dumps({
      "name": name,
      "files": [str(file) for file in asset_files]
    }, indent=2)
    Path('./storage/' + name + '.asset').write_text(asset_definition)

def ready():
  with open(".storage/.output", 'w') as file:
    file.write("")

def input(prompt = "", extract = False, messages = []):
  global input_first
  if not input_first:
    ready()
  input_first = False

  print(prompt, end="")
  prompt = input_original()
  prompt = prompt.replace('\f', '\n')

  if extract:
    prompt = url_contents(text)

  messages.append({"role": "user", "content": prompt})
  return prompt
