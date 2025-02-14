import os

def describe_content(target_path):
  result = {'type': ''}
  
  if os.path.isfile(target_path) and target_path.endswith('.py'):
    python_files = [os.path.basename(target_path)]
    folder = os.path.dirname(target_path) or '.'
  else:
    folder = target_path
    python_files = [f for f in os.listdir(folder) if f.endswith('.py')]
  
  target_file = None
  
  if 'app.py' in python_files:
    target_file = 'app.py'
  elif 'main.py' in python_files:
    target_file = 'main.py'
  elif len(python_files) == 1:
    target_file = python_files[0]
  
  if target_file:
    with open(os.path.join(folder, target_file), 'r', encoding='utf-8') as file:
      content = file.read()
      if 'import FastAPI' in content or 'import Flask' in content:
        result['type'] = 'fastapi'
  
  return result
