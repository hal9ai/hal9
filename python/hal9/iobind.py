import json
import os
from pathlib import Path

def add_extension(path):
  _, extension = os.path.splitext(path)
  if not extension:
    path = path + ".json"
  return Path(path)

def load(file, default):
  file_path = add_extension(file + ".json")
  if file_path.exists():
    contents = json.loads(file_path.read_text())
  else:
    contents = default
  return contents

def save(file, contents):
  file_path = add_extension(file)
  file_path.write_text(json.dumps(contents, indent=2))