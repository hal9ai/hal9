from groq import Groq
from utils import stream_print

def answer_generic_question(user_input):
    response = Groq().chat.completions.create(
     model = "llama3-70b-8192",
     messages = [{"role": "user", "content": user_input}],
    temperature = 0,
    seed = 1)

    text_response = response.choices[0].message.content
    stream_print(text_response)
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