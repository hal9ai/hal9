import inspect
import json

type_mapping = {
  int: "integer",
  str: "string",
  float: "number",
  bool: "boolean",
  list: "array",
  dict: "object"
}

def describe_single(func):
  """
  Takes a function and returns its metadata as a JSON string in the specified format.
  """
  signature = inspect.signature(func)
  params = signature.parameters

  # Collecting function metadata
  func_name = func.__name__
  func_doc = inspect.getdoc(func) or ""

  properties = {}
  for name, param in params.items():
    param_type = param.annotation
    if param_type in type_mapping:
      json_type = type_mapping[param_type]
    else:
      json_type = "string"  # default to string if type is not mapped
    properties[name] = {"type": json_type}

  result = {
    "name": func_name,
    "description": func_doc,
    "parameters": {
      "type": "object",
      "properties": properties,
      "required": list(properties.keys())
    }
  }

  return result

def describe(functions):
  return [describe_single(func) for func in functions]

def complete(completion, messages = [], tools = [], show = True):
  tools = {func.__name__: func for func in tools}
  content = result= ""
  tool_name = tool_text = ""
  tool_args = None

  if not 'stream' in str(type(completion)).lower():
    content = completion.choices[0].message.content
    if chunk.choices[0].message.function_call != None:
      tool_name = chunk.choices[0].message.function_call.name
      tool_args = json.loads(chunk.choices[0].message.function_call.arguments)
    if show:
      print(content)
  else:
    for chunk in completion:
      if chunk.choices and len(chunk.choices) > 0 and chunk.choices[0].delta:
        if chunk.choices[0].delta.content:
          if show:
            print(chunk.choices[0].delta.content, end="")
          content += chunk.choices[0].delta.content
        if chunk.choices[0].delta.function_call != None:
          tool_text += chunk.choices[0].delta.function_call.arguments
          if chunk.choices[0].delta.function_call.name:
            tool_name = chunk.choices[0].delta.function_call.name
          try:
            tool_args = json.loads(tool_text)
          except Exception as e:
            pass
    if show:
      print()

  if len(content) > 0:
    messages.append({ "role": "assistant", "content": content})

  if tool_args:
    if tool_name in tools:
      try:
        result = str(tools[tool_name](**tool_args))
      except Exception as e:
        result = str(e)
        print(result)
      messages.append({ "role": "function", "name": tool_name, "content": result})

  return content + result