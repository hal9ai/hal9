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

def describe(functions, model = "openai"):
  tools = [describe_single(func) for func in functions]

  if model == "llama":
    tools = [{ "type": "function", "function": tool} for tool in tools]

  return tools

def complete_openai(completion, messages = [], tools = [], show = True):
  tools = {func.__name__: func for func in tools}
  content = result= ""
  tool_name = tool_text = ""
  tool_args = None

  if not 'stream' in str(type(completion)).lower():
    content = completion.choices[0].message.content
    if completion.choices[0].message.function_call != None:
      tool_name = completion.choices[0].message.function_call.name
      tool_args = json.loads(completion.choices[0].message.function_call.arguments)
    if show:
      print(content)
  else:
    if completion:
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
      error = False
      try:
        result = str(tools[tool_name](**tool_args))
      except Exception as e:
        error = True
        result = str(e)

      messages.append({ "role": "function", "name": tool_name, "content": result})
      
      if error:
          raise Exception(result)

  return content + result

def complete_llama(completion, messages = [], tools = [], show = True):
  response = ""
  if not 'stream' in str(type(completion)).lower():
    
    response_message = completion.choices[0].message
    tool_calls = response_message.tool_calls
    
    if tool_calls:
      tools = {func.__name__: func for func in tools}
      for tool_call in tool_calls:
        messages.append({
          "role": "assistant",
          "tool_calls": [{
            "id": tool_call.id,
            "function": {
              "name": tool_call.function.name,
              "arguments": tool_call.function.arguments
            },
            "type": "function"
          }]
        })

        function_name = tool_call.function.name
        function_to_call = tools[function_name]
        function_args = json.loads(tool_call.function.arguments)

        error = False
        try:
          response = str(function_to_call(**function_args))
        except Exception as e:
          error = True
          response = str(e)

        messages.append(
          {
            "tool_call_id": tool_call.id,
            "role": "tool",
            "name": function_name,
            "content": response
          }
        )

        if error:
          raise Exception(response)

        if show:
          print(response)
    else:
      response = completion.choices[0].message.content
      print(response)
  else:
    for chunk in completion:
      if len(chunk.choices) > 0 and chunk.choices[0].delta.content is not None: 
        if show:
          print(chunk.choices[0].delta.content, end="")
        response += chunk.choices[0].delta.content

  messages.append({"role": "assistant", "content": response})

completion_handlers = {
  "openai": complete_openai,
  "llama": complete_llama
}

def complete(completion, messages = [], tools = [], show = True, model = "openai"):
  if model not in completion_handlers:
    raise Exception(f"Don't know how to complete model {model}")

  return completion_handlers[model](completion, messages, tools, show)
  