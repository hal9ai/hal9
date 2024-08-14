def calculate(expression):
  """
  Performs aritmetic operations for numerical questions.
    'expression' is the aritmetic operations to evaluate, needs conversion to proper Python syntax.
  """
  try:
    result = eval(expression)
    print(result)
    return result
  except Exception as e:
    print("Failed with " + str(e))
    return "Failed with " + str(e)