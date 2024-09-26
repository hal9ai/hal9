from pathlib import Path

from hal9.runtimes.image import run as run_image
from hal9.runtimes.python import run as run_python
from hal9.runtimes.chainlit import run as run_chainlit

runtime_types = {
  "python": run_python,
  "image": run_image,
  "jpg": run_image,
  "png": run_image,
  "chainlit": run_chainlit,
}

def run(path :str, source :str = "app.py", runtime :str = "python", port :str = "8080") -> str:
  """Run an application

  Parameters
  ----------
  path : str 
          Path to the application.
  source : str 
          The main file to run. Defaults to 'app.py'.
  runtime : str 
          The runtime to use to run the source. Defaults to 'python'.
  """

  source_path = Path(path) / source

  if not source_path.is_file():
    print(f"Failed to run {source_path}")
    return

  try:
    if runtime in runtime_types:
      runtime_types[runtime](source_path, port)
    else:
      print(f"Unsupported runtime: {runtime}")
  except Exception as e:
    print(f"An error occurred while running {source}: {e}")

def run_describe():
  keys = list(runtime_types.keys())
  return {
    'runtimes': keys
  }
