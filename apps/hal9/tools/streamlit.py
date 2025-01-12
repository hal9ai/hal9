from utils import generate_response, load_messages, insert_message, extract_code_block, save_messages
import os
import traceback
from clients import openai_client


def fix_code(chat_input, error, complete_traceback, python_code):
    stream = openai_client.chat.completions.create(
      model =  "gpt-4-turbo",
      messages = [
        {"role": "user", "content": 
f"""The following Python code needs to be fixed. It should create a interactive Streamlit app fulfill this user request: '{chat_input}', return the fixed code as fenced code block with triple backticks (```) as ```python```

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
        exec(python_code)
        return "About to show your app...", "", ""
    except Exception as e:
        tb = traceback.format_exc()
        relevant_error_info = tb.splitlines()
        last_line = relevant_error_info[-1]
        complete_traceback="\n".join(relevant_error_info)
        return "App fails to run", last_line, complete_traceback
    
def save_python_code(code):
    directory = "./.storage/app.py"
    # Ensure the target directory exists
    if not os.path.exists(directory):
        os.makedirs(directory)
      
    # Write the code to the app.py file
    python_file_path = os.path.join(directory, "app.py")
    with open(python_file_path, 'w') as file:
        file.write(code)

def streamlit_generator(prompt):
    # load messages
    messages = load_messages(file_path="./.storage/.streamlit_messages.json")

    if len(messages) < 1:
        messages = insert_message(messages, "system", f"""This is a Python streamlit generator system that automates the creation of Streamlit apps based on user prompts. It interprets natural language queries, and the response is an complete python script with the including imports for a interactive Streamlit app, return the code as fenced code block with triple backticks (```) as ```python```""")
    messages = insert_message(messages, "user", f"Generates an app that fullfills this user request -> {prompt}")
    model_response = generate_response("openai", "gpt-4-turbo", messages) 
    response_content = model_response.choices[0].message.content
    streamlit_code = extract_code_block(response_content, "python")
    # Debug and fix the code if needed
    max_tries = 3
    tries = 0
    while tries < max_tries:
        result, error, complete_traceback = debug_code(streamlit_code)
        if result == "About to show your app...":
            save_python_code(streamlit_code)
            messages = insert_message(messages, "assistant", streamlit_code)
            save_messages(messages, file_path="./.storage/.streamlit_messages.json")
            print(result)
            return result
        else:
            streamlit_code = fix_code(prompt, error, complete_traceback, streamlit_code)
        tries += 1

    print("Unable to generate an app that fulfills your request without errors.")
    return "Unable to generate an app that fulfills your request without errors."
    
streamlit_generator_description = {
    "type": "function",
    "function": {
        "name": "streamlit_generator",
        "description": "Generates a complete Python Streamlit app based on user-provided natural language prompts. It automates the creation of interactive applications that requires interactions (This tool do not interact with files uploaded)",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "prompt": {
                    "type": "string",
                    "description": "A detailed natural language description of the desired Streamlit app, including specific requirements or features to implement.",
                }
            },
            "required": ["prompt"],
            "additionalProperties": False,
        },
    }
}