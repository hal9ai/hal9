
def solve_math_problem(steps_explanation, code_solution):
  print("Steps:\n")
  print(steps_explanation)
  print("\n\nPython Code:\n")
  exec(code_solution)
  return f"Steps:\n{steps_explanation}\n\n\nPython Code: {code_solution}"

solve_math_problem_description = {
    "type": "function",
    "function": {
        "name": "solve_math_problem",
        "description": "This function provides solutions to mathematical problems by offering both a step-by-step breakdown of the problem-solving process and a Python code implementation. It ensures clarity by explaining relevant concepts, formulas, and logic, while also demonstrating how the solution can be executed programmatically.",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "steps_explanation": {
                    "type": "string",
                    "description": "A comprehensive, step-by-step description of how to solve the specified mathematical problem, including relevant formulas and concepts.",
                },
                "code_solution": {
                    "type": "string",
                    "description": "A complete Python script with imports that executes the described solution, clearly demonstrating the implementation of each step and outputting the final answer with a print.",
                },
            },
            "required": ["steps_explanation", "code_solution"],
            "additionalProperties": False,
        },
    }
}
