import subprocess
from pathlib import Path

def run(source_path :Path, port :str):
  code = f"library(plumber);pr_run(pr('{source_path}'), port={port})"
  command = ['Rscript', '-e', code]
  with subprocess.Popen(command) as proc:
    proc.wait()
