import os
import tempfile
import urllib.parse
import urllib.request
import importlib.util

def is_url(prompt):
  result = urllib.parse.urlparse(prompt)
  return all([result.scheme, result.netloc])

def url_contents(prompt):
  try:
    if not is_url(prompt):
      return prompt
  
    textract_spec = importlib.util.find_spec("textract")
    if textract_spec is None:
      return prompt

    file_extension = os.path.splitext(prompt)[1]

    with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
      with urllib.request.urlopen(prompt) as response:
        temp_file.write(response.read())
      temp_file_path = temp_file.name

    import textract
    text = textract.process(temp_file_path).decode("utf-8")
    os.remove(temp_file_path)
    return text
  except Exception as e:
    return prompt
