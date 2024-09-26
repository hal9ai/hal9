import subprocess
from pathlib import Path
import time

def run(source_path: Path, port :str):
  command = ['chainlit', 'run', '-h', '--port', port, source_path]
  print(command)

  with subprocess.Popen(command) as proc:
    proc.wait()
