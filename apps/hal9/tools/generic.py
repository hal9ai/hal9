from groq import Groq
from utils import load_messages, insert_message, save_messages
from concurrent.futures import ThreadPoolExecutor

answer_generic_future = None

def answer_generic_question(user_input):
    global answer_generic_future
    if answer_generic_future is not None:
        text_response=answer_generic_future.result()
        print(text_response)
        return text_response
    else:
        with ThreadPoolExecutor() as executor:
            answer_generic_future = executor.submit(process_request, user_input)
            text_response = answer_generic_future.result()
            return text_response

def process_request(user_input):
    messages = load_messages(file_path="./.storage/.generic_agent_messages.json")
    messages = insert_message(messages, "user", user_input)
    response = Groq().chat.completions.create(
        model="llama3-70b-8192",
        messages=messages,
        temperature=0,
        seed=1
    )
    text_response = response.choices[0].message.content
    messages = insert_message(messages, "assistant", text_response)
    save_messages(messages, file_path="./.storage/.generic_agent_messages.json")
    return text_response

answer_generic_question_description = {
    "type": "function",
    "function": {
        "name": "answer_generic_question",
        "description": "Handles general questions or queries provided by the user by taking their input and generating a meaningful response.",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "user_input": {
                    "type": "string",
                    "description": "Take the user input and pass the same string to the function",
                },
            },
            "required": ["user_input"],
            "additionalProperties": False,
        },
    }
}