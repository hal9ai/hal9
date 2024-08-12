def calculate(expression):
  """
  Evaluate a mathematical expression in Python.
    'expression' is the mathematical expression to evaluate needs conversion to proper Python syntax.
  """
  try:
    result = eval(expression)
    print(result)
    return result
  except Exception as e:
    return "Failed with " + str(e)