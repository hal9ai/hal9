import os
import shutil
from pathlib import Path

def create(path :str, template :str) -> str:
  """Create an application

  Parameters
  ----------
  path : str 
          Path to the application.
  template : str 
          The template to use.
  """

  package_dir = Path(__file__).parent
  template_path = package_dir / "templates" / template

  os.makedirs(path, exist_ok=True)

  for item in template_path.iterdir():
    dest = Path(path) / item.name
    if item.is_dir():
      shutil.copytree(item, dest)
    else:
      shutil.copy2(item, dest)

  print(f'Project created!')
