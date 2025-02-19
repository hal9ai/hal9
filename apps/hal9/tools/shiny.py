from utils import generate_response, load_messages, insert_message, extract_code_block, save_messages
import os
import traceback
from clients import openai_client

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
    
def save_shiny_code(code):
    directory = "./.storage/app.R"
    # Ensure the target directory exists
    if not os.path.exists(directory):
        os.makedirs(directory)
      
    # Write the code to the app.R file
    python_file_path = os.path.join(directory, "app.R")
    with open(python_file_path, 'w') as file:
        file.write(code)

def shiny_generator(prompt):
    # load messages
    messages = load_messages(file_path="./.storage/.shiny_messages.json")

    if len(messages) < 1:
        messages = insert_message(messages, "system", f"""This is a R Shiny generator system that automates the creation of R shiny apps based on user prompts. It interprets natural language queries, and the response is an complete R script with the including imports for a interactive R Shiny app, return the code as fenced code block with triple backticks (```) as ```r```""")
    messages = insert_message(messages, "user", f"Generates an app that fullfills this user request -> {prompt}")
    model_response = generate_response("openai", "gpt-4-turbo", messages) 
    response_content = model_response.choices[0].message.content
    shiny_code = extract_code_block(response_content, "r")
    
    save_shiny_code(shiny_code)
    messages = insert_message(messages, "assistant", shiny_code)
    save_messages(messages, file_path="./.storage/.shiny_messages.json")
    return "About to show your app..."
    
shiny_generator_description = {
    "type": "function",
    "function": {
        "name": "shiny_generator",
        "description": "Generates a complete R Shiny app based on user-provided natural language prompts. It automates the creation of interactive applications that requires interactions (This tool do not interact with files uploaded)",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "prompt": {
                    "type": "string",
                    "description": "A detailed natural language description of the desired R Shiny app, including specific requirements or features to implement.",
                }
            },
            "required": ["prompt"],
            "additionalProperties": False,
        },
    }
}