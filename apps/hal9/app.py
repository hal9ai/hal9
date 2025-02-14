from utils import generate_response, load_messages, insert_message, execute_function, save_messages, insert_tool_message, is_url, download_file, generate_text_embeddings_parquet
from tools.calculator import solve_math_problem_description, solve_math_problem
from tools.generic import answer_generic_question_description, answer_generic_question
from tools.csv_agent import analyze_csv_description, analyze_csv
from tools.image_agent import images_management_system, images_management_system_description, add_images_descriptions
from tools.hal9 import answer_hal9_questions_description, answer_hal9_questions
from tools.text_agent import analyze_text_file_description, analyze_text_file
from tools.streamlit import streamlit_generator, streamlit_generator_description
from tools.fastapi import fastapi_generator, fastapi_generator_description
from tools.other_tools import final_response_description, final_response
from tools.python_execution import python_execution_description ,python_execution

# load messages
messages = load_messages()

# load tools
tools_descriptions = [python_execution_description, final_response_description, solve_math_problem_description, answer_generic_question_description, analyze_csv_description, images_management_system_description, answer_hal9_questions_description, analyze_text_file_description, fastapi_generator_description, streamlit_generator_description]
tools_functions = [python_execution, final_response, solve_math_problem, answer_generic_question, analyze_csv, images_management_system, answer_hal9_questions, analyze_text_file, fastapi_generator, streamlit_generator]

if len(messages) < 1:
    messages = insert_message(messages, "system", "You are Hal9, a helpful and highly capable AI assistant. Your primary responsibility is to analyze user questions and select the most appropriate tool to provide precise, relevant, and actionable responses. Always prioritize using the right tool to ensure efficiency and clarity in your answers. If a tool is needed, follow these steps: 1. Identify the best tool for the task. 2. Execute the tool and process its response. 3. If the tool provides a valid result, return it to the user. 4. If the tool fails, do NOT retry with the same tool. Instead, explain the failure and suggest improvements in the prompt or alternative approaches.")
user_input = input()
if is_url(user_input):
    filename = user_input.split("/")[-1]
    file_extension = filename.split(".")[-1] if "." in filename else "No extension"
    download_file(user_input)
    messages = insert_message(messages, "system", f"Consider using the file available at path: './.storage/.{filename}' for the following questions.")
    messages = insert_message(messages, "assistant", f"I'm ready to answer questions about your file: {filename}")
    if file_extension.lower() == "pdf":
        generate_text_embeddings_parquet(user_input)
    if file_extension.lower() in ['jpg', 'jpeg', 'png','webp']:
        add_images_descriptions(f"./.storage/.{filename}")
    print(f"I'm ready to answer questions about your file: {filename}")
else:
    user_input = user_input.replace("\f", "\n")
    messages = insert_message(messages, "user", user_input)
    steps = 0
    max_steps = 6
    while steps < max_steps:
        response = generate_response("openai", "gpt-4o-mini", messages, tools_descriptions, tool_choice = "required", parallel_tool_calls=False)
        tool_result = execute_function(response, tools_functions)
        insert_tool_message(messages, response, tool_result)
        save_messages(messages, file_path="./.storage/.messages.json")
        response_message = response.choices[0].message
        tool_calls = getattr(response_message, 'tool_calls', None)
        if tool_calls[0].function.name == "final_response":
            break
    if max_steps == steps:
        print("Unable to generate a satisfactory response on time")