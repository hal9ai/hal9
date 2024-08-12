import hal9 as h9
import openai
import os
import requests

def create_image(prompt, filename):
  """
  Creates an image or photograph for the user
    'prompt' with the description of the image or photograph
    'filename' a descriptive filename with png extension for the image or photograph to generate
  """
  client = openai.AzureOpenAI(
    azure_endpoint = 'https://hal9-azure-openai-eastus.openai.azure.com/',
    api_key = os.environ['DALLE_AZURE'],
    api_version = "2024-02-01",
  )

  response = client.images.generate(
    model="dall-e-3",
    prompt=prompt,
    size="1024x1024",
    quality="standard",
    n=1,
  )
  url = response.data[0].url

  response = requests.get(url)

  with open('storage/' + filename, 'wb') as file:
    file.write(response.content)

  return f"Generated a {filename} that {prompt}"
