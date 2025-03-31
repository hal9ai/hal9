from data import DATA
from groq import Groq
import os

def answer_hal9_questions(user_input):
    response = Groq(api_key=os.environ['HAL9_TOKEN']).chat.completions.create(
        model = "llama3-70b-8192",
        messages = [{"role": "system", "content": DATA["hal9"]},{"role": "user", "content": user_input}],
        temperature = 0,
        seed = 1,)

    return response.choices[0].message.content

answer_hal9_questions_description = {
    "type": "function",
    "function": {
        "name": "answer_hal9_questions",
        "description": "Handles questions related to Hal9 or this chatbot-web capabilities",
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