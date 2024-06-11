import json
import os
from pathlib import Path

def add_extension(path):
  _, extension = os.path.splitext(path)
  if not extension:
    path = path + ".json"
  return Path(path)

def get_extension(file_path):
  _, extension = os.path.splitext(file_path)
  return extension.lstrip('.')

def load(file, default):
  file_path = add_extension(file + ".json")
  if file_path.exists():
    contents = json.loads(file_path.read_text())
  else:
    contents = default
  return contents

def save(name, contents):
  file_path = add_extension(name)
  extension = get_extension(file_path)
  if (extension == "json"):
    contents = json.dumps(contents, indent=2)
  
  file_path.write_text(contents)