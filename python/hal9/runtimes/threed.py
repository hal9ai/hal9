import subprocess
from pathlib import Path
import time
import shutil

def run(source_path: Path, port :str, params :str):
  image_directory = source_path.parent
  model_name = source_path.name

  html_content = f"""
<html>
<head>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/online-3d-viewer@0.15.0/build/engine/o3dv.min.js"></script>
</head>
<body>
  <a id="open-link" href="{model_name}" target="_blank" rel="noopener noreferrer">Open {model_name}</a>
  <div class="online_3d_viewer" style="width: 100%; height: 100%;" model="{model_name}"></div>
  <script>window.addEventListener ('load', () => {{ OV.Init3DViewerElements (); }});</script>
  <script>
    document.addEventListener("DOMContentLoaded", function () {{
      const link = document.getElementById("open-link");
      const currentPageUrl = window.location.href + '{model_name}'; 
      link.href = `https://3dviewer.net/#model=${{currentPageUrl}}`;
    }});
  </script>
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
