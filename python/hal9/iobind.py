import json
from pathlib import Path

def load(file, default):
  file_path = Path(file + ".json")
  if file_path.exists():
    contents = json.loads(file_path.read_text())
  else:
    contents = default
  return contents

def save(file, contents):
  file_path = Path(file + ".json")
  file_path.write_text(json.dumps(contents, indent=2))