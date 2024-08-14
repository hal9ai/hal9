def calculate(expression):
  """
  Calculates a math expression in Python, only use for numerical questions.
    'expression' is the mathematical expression to evaluate, needs conversion to proper Python syntax.
  """
  try:
    result = eval(expression)
    print(result)
    return result
  except Exception as e:
    print("Failed with " + str(e))
    return "Failed with " + str(e)