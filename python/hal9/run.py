import subprocess
from pathlib import Path

def run(path :str) -> str:
  """Run an application

  Parameters
  ----------
  path : str 
          Path to the application.
  """

  app_path = Path(path) / 'app.py'

  if not app_path.is_file():
    print(f"Failed to run {app_path}")
    return

  try:
    command = ['python', str(app_path)]
    with subprocess.Popen(command) as proc:
      proc.wait()
  except Exception as e:
    print(f"An error occurred while running app.py: {e}")