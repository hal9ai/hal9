import subprocess
from pathlib import Path

def run(source_path :Path, port :str):
  command = ['python3', str(source_path)]
  with subprocess.Popen(command) as proc:
    proc.wait()
