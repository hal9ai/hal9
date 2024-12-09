import subprocess
from pathlib import Path

def run(source_path :Path, port :str):
  rprofile_content = f"""
options(shiny.port = {port})
"""

  rprofile_path = Path.cwd() / ".Rprofile"
  with open(rprofile_path, "w") as rprofile_file:
    rprofile_file.write(rprofile_content)

  command = ['Rscript', source_path]
  with subprocess.Popen(command) as proc:
    proc.wait()
