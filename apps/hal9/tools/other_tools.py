def final_response(final_message):
    print(final_message)
    return final_message

final_response_description = { 
    "type": "function",
    "function": {
        "name": "final_response",
        "description": "This function is called when all necessary steeps has been completed through the tools, and all the requirements or the information requested by the user has been collected. It finalizes the process and delivers the results in a clear and concise message.",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "final_message": {
                    "type": "string",
                    "description": "A clear and concise message that directly answers the user's question. Do not mention any tools or internal processes used to obtain the answer.",
                },
            },
            "required": ["final_message"],
            "additionalProperties": False,
        },
    }
}