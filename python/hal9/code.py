import re

def extract_one(markdown, language, default = None):
  pattern = re.compile(rf'```{language}[^\n]*\n(.*?)```', re.DOTALL)
  code_blocks = pattern.findall(markdown)
  code = '\n'.join(code_blocks)
  if len(code) == 0:
    return default
  return code

def extract_all(markdown, default=None):
  if default is None:
    result = {}
  else:
    result = default

  pattern = re.compile(r'```(?:(\w+)(?:\s+filename=([^\s]+))?)?\s+(.*?)```', re.DOTALL)
  matches = pattern.findall(markdown)
  code_dict = {}
  for lang, filename, code in matches:
    key = filename if filename else lang if lang else 'unknown'
    if key not in code_dict:
      code_dict[key] = []
    code_dict[key].append(code)
  
  for key in code_dict:
    result[key] = '\n'.join(code_dict[key])

  return result

def extract(markdown, language = None, default = None):
  if language:
    return extract_one(markdown, language, default)
  else:
    return extract_all(markdown, default)
