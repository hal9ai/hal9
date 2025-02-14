from utils import generate_response, load_messages, insert_message, extract_code_block, save_messages
import os
import traceback
from clients import openai_client

def save_python_code(code):
    directory = "./.storage/app.py"
    # Ensure the target directory exists
    if not os.path.exists(directory):
        os.makedirs(directory)
      
    # Write the code to the app.py file
    python_file_path = os.path.join(directory, "app.py")
    with open(python_file_path, 'w') as file:
        file.write(code)

def fastapi_generator(prompt):
    # load messages
    messages = load_messages(file_path="./.storage/.fastapi_messages.json")

    if len(messages) < 1:
        messages = insert_message(messages, "system", f"""
This is a Python fastapi generator system that automates the creation of FastAPI APIs based on user prompts. 
It interprets natural language queries, and the response is an complete python script with the including imports for a interactive FastAPI app, 
return the code as fenced code block with triple backticks (```) as ```python```

Make sure the path / has functionality or at least a description of the other paths since the user will be presented with this path by default.

Here is an example to consider or provide to the user when they don't specify requirements:

```python
from fastapi import FastAPI
import random
app = FastAPI()
@app.get("/")
async def roll():
  return random.randint(1, 6)
```
        """)
    messages = insert_message(messages, "user", f"Generates an app that fullfills this user request -> {prompt}")
    model_response = generate_response("openai", "gpt-4-turbo", messages) 
    response_content = model_response.choices[0].message.content
    fastapi_code = extract_code_block(response_content, "python")

    save_python_code(fastapi_code)
    messages = insert_message(messages, "assistant", fastapi_code)
    save_messages(messages, file_path="./.storage/.fastapi_messages.json")

    result = "About to show your API..."
    print(result)
    return result
    
fastapi_generator_description = {
    "type": "function",
    "function": {
        "name": "fastapi_generator",
        "description": "Generates a complete Python FastAPI API based on user-provided natural language prompts. It automates the creation of an API that requires interactions (This tool do not interact with files uploaded)",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "prompt": {
                    "type": "string",
                    "description": "A detailed natural language description of the desired FastAPI API, including specific requirements or features to implement.",
                }
            },
            "required": ["prompt"],
            "additionalProperties": False,
        },
    }
}