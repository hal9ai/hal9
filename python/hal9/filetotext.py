import os
import tempfile
import urllib.parse
import urllib.request
import importlib.util

def extract_from_url(message):
  try:
    result = urllib.parse.urlparse(message)
    if not all([result.scheme, result.netloc]):
      return message
  
    textract_spec = importlib.util.find_spec("textract")
    if textract_spec is None:
      return message

    file_extension = os.path.splitext(result.path)[1]

    with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
      with urllib.request.urlopen(message) as response:
        temp_file.write(response.read())
      temp_file_path = temp_file.name

    import textract
    text = textract.process(temp_file_path).decode("utf-8")
    os.remove(temp_file_path)
    return text
  except Exception as e:
    return message
