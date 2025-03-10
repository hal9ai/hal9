from clients import groq_client
from utils import load_messages, insert_message, save_messages

def answer_generic_question(user_input):
    messages = load_messages(file_path="./.storage/.generic_agent_messages.json")
    messages = insert_message(messages, "user", user_input)
    response = groq_client.chat.completions.create(
        model="llama3-8b-8192",
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
                    "description": "A generic question that requires to be answered",
                },
            },
            "required": ["user_input"],
            "additionalProperties": False,
        },
    }
}