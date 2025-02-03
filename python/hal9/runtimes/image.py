import subprocess
from pathlib import Path
import time
import shutil

def run(source_path: Path, port :str, params :str):
  image_directory = source_path.parent
  image_name = source_path.name

  html_content = f"""
  <html>
  <body>
    <img src="{image_name}" height="100%" />
  </body>
  </html>
  """

  html_file_path = image_directory / 'index.html'

  with open(html_file_path, 'w') as html_file:
    html_file.write(html_content)

  if source_path.suffix.lower() == ".png":
    shutil.copy(source_path, image_directory / f"screenshot_d41d8cd98f00b204e9800998ecf8427e.png")

  command = ['python3', '-m', 'http.server', '--directory', str(image_directory), port]

  with subprocess.Popen(command) as proc:
    proc.wait()
