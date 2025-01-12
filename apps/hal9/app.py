from utils import generate_response, load_messages, insert_message, execute_function, save_messages, insert_tool_message, is_url, download_file, generate_text_embeddings_parquet
from tools.calculator import solve_math_problem_description, solve_math_problem
from tools.generic import answer_generic_wrapper_description, answer_generic_wrapper, answer_generic_question_submit
from tools.generic import answer_generic_question, answer_generic_question_description
from tools.csv_agent import analyze_csv_description, analyze_csv
from tools.image_agent import images_management_system, images_management_system_description, add_images_descriptions
from tools.hal9 import answer_hal9_questions_description, answer_hal9_questions
from tools.text_agent import analyze_text_file_description, analyze_text_file
from tools.streamlit import streamlit_generator, streamlit_generator_description
from tools.website import website_generator, website_generator_description
from concurrent.futures import ThreadPoolExecutor, Future

# load messages
messages = load_messages()

# load tools
tools_descriptions = [answer_generic_wrapper_description, solve_math_problem_description, analyze_csv_description, images_management_system_description, answer_hal9_questions_description, analyze_text_file_description, streamlit_generator_description, website_generator_description]
tools_functions = [answer_generic_wrapper, solve_math_problem, analyze_csv, images_management_system, answer_hal9_questions, analyze_text_file, streamlit_generator, website_generator]

if len(messages) < 1:
    messages = insert_message(messages, "system", "You are Hal9, a helpful and highly capable AI assistant. Your primary responsibility is to analyze user questions and select the most appropriate tool to provide precise, relevant, and actionable responses. Always prioritize using the right tool to ensure efficiency and clarity in your answers.")

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

    with ThreadPoolExecutor() as executor:
        answer_generic_question_submit(executor, user_input)
        
        messages = insert_message(messages, "user", user_input)

        response = generate_response("openai", "gpt-4-turbo", messages, tools_descriptions, tool_choice = "required", parallel_tool_calls=False)

        tool_result = execute_function(response, tools_functions)

        insert_tool_message(messages, response, tool_result)

save_messages(messages)