import subprocess
from pathlib import Path
import time
import configparser
import json

def handle_params(params :str):
  parsed_params = json.loads(params)

  try:
    result = subprocess.run(["chainlit", "init"], check=False, stderr=subprocess.DEVNULL)
  except Exception as e:
    print(f"Ignoring error: {e}")

  config_file = Path(".chainlit/config.toml")
  if config_file.exists():
    config = configparser.ConfigParser()
    config.read(config_file)

    if 'UI' not in config:
      config['UI'] = {}

    if parsed_params.get("dark") is False:
      config['UI']['default_theme'] = '"light"'
    
    with open(config_file, 'w') as configfile:
      config.write(configfile)
  else:
    print(f"Config file {config_file} does not exist. Please create it before running this script.")

def run(source_path: Path, port :str, params :str):
  if params:
    handle_params(params)

  command = ['chainlit', 'run', '-h', '--port', port, source_path]
  print(command)

  with subprocess.Popen(command) as proc:
    proc.wait()
