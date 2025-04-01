import os

type_checks = {
  'fastapi': {
    'files': ['app.py', 'main.py'],
    'contents': ['import FastAPI', 'import Flask']
  },
  'shiny': {
    'files': ['app.R'],
    'contents': ['library(shiny)']
  },
  'streamlit': {
    'files': ['app.py', 'main.py'],
    'contents': ['import streamlit']
  }
}

def describe_content(target_path):
  result = {'type': ''}
    
  if os.path.isfile(target_path):
      all_files = [target_path]
  elif os.path.isdir(target_path):
      all_files = os.listdir(target_path)
  else:
      return result
  
  for type_name, criteria in type_checks.items():
    for target_file in criteria['files']:
      if target_file in all_files:
        with open(os.path.join(target_path, target_file), 'r', encoding='utf-8') as file:
          content = file.read()
          if any(keyword in content for keyword in criteria['contents']):
            result['type'] = type_name
            break

  return result
