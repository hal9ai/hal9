import json
import os
from pathlib import Path
from hal9.urls import url_contents
import pickle
import tempfile
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
    if isinstance(contents, (dict, list, str)):
      name = name + ".json"
    elif isinstance(contents, bytes):
      name = name + ".txt"
    elif contents_type == "<class 'PIL.Image.Image'>":
      name = name + ".jpg"
    else:
      name = name + ".pkl"
  return name
def find_extension(file_path):
  possible_extensions = ['.json', '.pkl', '.txt']
  base_path = Path(file_path)

  # Check if the file exists as provided
  if base_path.exists():
    return base_path

  # Try known extensions
  for ext in possible_extensions:
    path_with_ext = base_path.with_suffix(ext)
    if path_with_ext.exists():
      return path_with_ext

  # Try hidden versions
  for ext in possible_extensions:
    hidden_path = base_path.parent / f".{base_path.name}{ext}"
    if hidden_path.exists():
      return hidden_path

  # Default to hidden `.pkl`
  hidden_default = base_path.parent / f".{base_path.name}.pkl"
  return hidden_default if hidden_default.exists() else base_path

def ensure_storage():
  if not os.path.exists('.storage'):
    os.mkdir('.storage')

def load(name, default):
  ensure_storage()

  file_path = find_extension(Path(".storage") / name)
  extension = get_extension(file_path)

  if file_path.exists():
    if extension == "json":
      with open(file_path, 'r') as file:
        return json.load(file)
    elif extension == "pkl":
      with open(file_path, 'rb') as file:
        return pickle.load(file)
    elif extension == "txt":
      with open(file_path, 'r') as file:
        return file.read()
  return default

def save(name, contents=None, hidden=False, files=None, encoding=None):
  ensure_storage()
  
  if not isinstance(name, str):
    raise Exception(f"The name parameter in save() must be a string, got {str(type(name))}")

  if hidden and not name.startswith('.'):
    name = "." + name

  if files is None:
    target_path = './.storage'
    files = {name: contents}
  else:
    target_path = tempfile.mkdtemp()
    if contents is not None:
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

    if extension == "json":
      contents = json.dumps(contents, indent=2)
      file_path.write_text(contents, encoding=encoding)
    elif extension == "pkl":
      with open(file_path, 'wb') as file:
        pickle.dump(contents, file)
    elif extension == "jpg":
      temp_path = Path(tempfile.mkdtemp()) / name
      contents.save(temp_path, format="JPEG")
      shutil.copy(temp_path, file_path)
    elif extension == "txt":
      file_path.write_text(contents, encoding=encoding)
    elif contents is None:
      raise Exception(f"Can't save empty contents for {name}")
    else:
      raise Exception(f"Don't know how to save {extension} for {contents_type}")

  if target_path != './.storage':
    asset_definition = json.dumps({
      "name": name,
      "files": [str(file) for file in asset_files]
    }, indent=2)
    Path('./.storage/' + name + '.asset').write_text(asset_definition)

def ready():
  with open(".storage/.output", 'w') as file:
    file.write("")

def input(prompt="", extract=False, messages=[]):
  global input_first
  if not input_first:
    ready()
  input_first = False

  print(prompt, end="")
  prompt = input_original()
  prompt = prompt.replace('\f', '\n')

  if extract:
    prompt = url_contents(prompt)

  messages.append({"role": "user", "content": prompt})
  return prompt