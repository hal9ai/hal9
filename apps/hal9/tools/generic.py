from groq import Groq
from utils import stream_print, load_messages, insert_message, save_messages

def answer_generic_question(user_input, show = True):
    # load messages
    messages = load_messages(file_path="./.storage/.generic_agent_messages.json")
    messages = insert_message(messages, "user", user_input)
    stream = Groq().chat.completions.create(
        model = "llama3-70b-8192",
        messages = messages,
        temperature = 0,
        seed = 1,
        stream = True)

    text_response = stream_print(stream, show)
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

answer_generic_future = None
def answer_generic_wrapper(user_input):
    result = answer_generic_future.result()
    print(result)

def answer_generic_question_submit(executor, user_input):
    global answer_generic_future
    answer_generic_future = executor.submit(answer_generic_question, user_input, False)

answer_generic_wrapper_description = {
    "type": "function",
    "function": {
        "name": "answer_generic_wrapper",
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