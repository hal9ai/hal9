from utils import generate_response, insert_message, extract_code_block
import traceback
from clients import openai_client
import time
import sys
import io

def fix_code(chat_input, error, complete_traceback, python_code):
    stream = openai_client.chat.completions.create(
      model =  "gpt-4-turbo",
      messages = [
        {"role": "user", "content": 
f"""The following Python code needs to be fixed. It should fulfill this user request: '{chat_input}', return the fixed code as fenced code block with triple backticks (```) as ```python```

### Error encountered:

{error}

### Code that needs fixing:

{python_code}

### Complete error traceback:

{complete_traceback}
"""
    },]
  )
    return extract_code_block(stream.choices[0].message.content, "python")

def debug_code(python_code):
    try:
        context = {}
        timestamp = int(time.time())
        with open(f"script_{timestamp}.txt", "w") as file:
            file.write(python_code)
        stdout_backup = sys.stdout
        sys.stdout = io.StringIO()
        exec(python_code, context)
        output = sys.stdout.getvalue()
        sys.stdout = stdout_backup
        return f"Code Works properly: result of the execution: {output}", "", ""
    except Exception as e:
        tb = traceback.format_exc()
        relevant_error_info = tb.splitlines()
        last_line = relevant_error_info[-1]
        complete_traceback="\n".join(relevant_error_info)
        return "App fails to run", last_line, complete_traceback
    
def python_execution(prompt):
    # load messages
    messages = []

    if len(messages) < 1:
        messages = insert_message(messages, "system", f"This Python generation system creates scripts from user prompts, including necessary imports; always include a print message indicating the process finished or the output. If a file is generated, it must be stored in './.storage/'. Return the code as a fenced block using triple backticks (```python```).")
    messages = insert_message(messages, "user", f"Generates an app that fullfills this user request -> {prompt}")
    model_response = generate_response("openai", "gpt-4-turbo", messages) 
    response_content = model_response.choices[0].message.content
    generated_code = extract_code_block(response_content, "python")
    # Debug and fix the code if needed
    max_tries = 3
    tries = 0
    while tries < max_tries:
        result, error, complete_traceback = debug_code(generated_code)
        if result.startswith("Code Works properly"):
            messages = insert_message(messages, "assistant", generated_code)
            return f"{result} ... This is the final code generated -> {generated_code}"
        else:
            generated_code = fix_code(prompt, error, complete_traceback, generated_code)
        tries += 1

    return f"Unable to generate an app that fulfills your request without errors. -> this was the final code obtained {generated_code} and the error found -> {error}"
    
python_execution_description = {
    "type": "function",
    "function": {
        "name": "python_execution",
        "description": "Executes and debugs Python scripts to solve problems that cannot be addressed with other tools. It can run arbitrary Python code to generate files or perform complex calculations.",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "prompt": {
                    "type": "string",
                    "description": "A detailed natural language description of the desired python code solution",
                }
            },
            "required": ["prompt"],
            "additionalProperties": False,
        },
    }
}