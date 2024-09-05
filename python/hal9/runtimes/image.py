import subprocess
from pathlib import Path
import time

def run(source_path: Path, port :str):
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

  command = ['python3', '-m', 'http.server', '--directory', str(image_directory), port]

  with subprocess.Popen(command) as proc:
    proc.wait()
