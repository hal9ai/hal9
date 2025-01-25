from pathlib import Path

from hal9.runtimes.image import run as run_image
from hal9.runtimes.python import run as run_python
from hal9.runtimes.chainlit import run as run_chainlit
from hal9.runtimes.r import run as run_r
from hal9.runtimes.plumber import run as run_plumber

runtime_types = {
  "python": run_python,
  "image": run_image,
  "jpg": run_image,
  "png": run_image,
  "chainlit": run_chainlit,
  "r": run_r,
  "shiny": run_r,
  "plumber": run_plumber,
}

def run(path :str, source :str = "app.py", type :str = "python", port :str = "8080", params :str = None) -> str:
  """Run an application

  Parameters
  ----------
  path : str 
          Path to the application.
  source : str 
          The main file to run. Defaults to 'app.py'.
  type : str 
          The type of runtime to use to run the source. Defaults to 'python'.
  params : str 
          An optional JSON string with a dictionary of additional parameters.
  """

  source_path = Path(path) / source

  if not source_path.is_file():
    print(f"Failed to run {source_path}")
    return

  try:
    if type in runtime_types:
      runtime_types[type](source_path, port, params)
    else:
      print(f"Unsupported runtime: {type}")
  except Exception as e:
    print(f"An error occurred while running {source}: {e}")

def run_describe():
  keys = list(runtime_types.keys())
  return {
    'runtimes': keys
  }
