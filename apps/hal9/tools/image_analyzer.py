import openai
import os

def image_analyzer(image_url, prompt):
    """Use this tool when the user provides a URL with an image extension such as JPG or PNG.
Parameters:
    'image_url' = URL containing the image or photograph.
    'prompt' = description of what the user wants to analyze in the image. If the user does not specify, it should default to "What's in this image?"
"""
    client = openai.AzureOpenAI(
    azure_endpoint = 'https://openai-hal9.openai.azure.com/',
    api_key = os.environ['OPENAI_AZURE'],
    api_version = '2024-02-15-preview',
    )

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url" : {"url": image_url,},
                    },
                ],
            }
        ],
    )

    print(response.choices[0].message.content)
    return response.choices[0].message.content