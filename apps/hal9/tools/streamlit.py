from utils import generate_response, load_messages, insert_message, extract_code_block, save_messages
import os
import traceback
from clients import openai_client
import hal9 as h9
import shutil
import datetime

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

def copy_files(source_dir, destination_dir):
    if not os.path.exists(destination_dir):
        os.makedirs(destination_dir)

    # Iterate over all items in the source directory
    for item in os.listdir(source_dir):
        source_path = os.path.join(source_dir, item)
        if os.path.isfile(source_path):
            if item.startswith(".") or item.endswith(".py"):
                continue
            else:
                destination_path = os.path.join(destination_dir, item)
                shutil.copy2(source_path, destination_path)

def save_python_code(code):
    # Use a timestamp for uniqueness and create a directory without a .py extension
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    directory = f"./.storage/app_{timestamp}.py"
    
    # Ensure the target directory exists
    if not os.path.exists(directory):
        os.makedirs(directory)

    try:
        # Copy files from ./.storage to the new target directory
        copy_files("./.storage/", directory)
    except Exception as e:
        traceback.print_exc()
        raise e

    # Write the Python code to an app.py file inside the new directory
    python_file_path = os.path.join(directory, "app.py")
    try:
        with open(python_file_path, 'w') as file:
            file.write(code.replace(".storage/", ""))
    except Exception as e:
        traceback.print_exc()
        raise e


def streamlit_generator(prompt):
    # load messages
    messages = load_messages(file_path="./.storage/.streamlit_messages.json")

    if len(messages) < 1:
        messages = insert_message(messages, "system", f"""This is a Python streamlit generator system that automates the creation of Streamlit apps based on user prompts. It interprets natural language queries, and the response is an complete python script with the including imports for a interactive Streamlit app, return the code as fenced code block with triple backticks (```) as ```python```""")
    messages = insert_message(messages, "user", f"Generates an app that fullfills this user request -> {prompt}")
    model_response = generate_response("openai", "o3-mini", messages) 
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
            return result
        else:
            h9.event("Streamlit Generator got an error", error)
            streamlit_code = fix_code(prompt, error, complete_traceback, streamlit_code)
        tries += 1

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