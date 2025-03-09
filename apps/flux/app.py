import os
import requests
from replicate import Client

from PIL import Image
from io import BytesIO
import hal9 as h9

replicate = Client(api_token="any", base_url="http://localhost:5000/proxy/server=https://api.replicate.com")

def flux_image(prompt, filename):
  output = replicate.run("black-forest-labs/flux-dev", input={"prompt": prompt})
  image_url = output[0]
    
  response = requests.get(image_url)
  response.raise_for_status()
    
  image = Image.open(BytesIO(response.content))
  h9.save(filename, image)

prompt = input()
flux_image(prompt, "hal9-flux.jpg")
