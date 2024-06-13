import json
import os
from pathlib import Path

def add_extension(path):
  _, extension = os.path.splitext(path)
  if not extension:
    path = path + ".json"
  return Path(path)

def get_hidden(file_path):
    directory = path.parent
    file_name = path.name
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
  file_path = add_extension(name)
  file_path = get_hidden(file_path, hidden)

  if file_path.exists():
    contents = json.loads(file_path.read_text())
  else:
    contents = default
  return contents

def save(name, contents, hidden = False):
  file_path = add_extension(name)
  file_path = add_hidden(file_path, hidden)

  extension = get_extension(file_path)
  if (extension == "json"):
    contents = json.dumps(contents, indent=2)
  
  file_path.write_text(contents)