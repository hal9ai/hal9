def calculate(expression):
  """
  Performs aritmetic operations for numerical questions.
    'expression' is the aritmetic operations to evaluate, needs conversion to proper Python syntax.
  """
  result = eval(expression)
  print(result)
  return result