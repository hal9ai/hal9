import os
import base64
import shutil
import requests
import replicate

from PIL import Image
from io import BytesIO


def flux_image(prompt, filename):
  output = replicate.run("black-forest-labs/flux-dev", input={"prompt": prompt})

  header, encoded = output[0].url.split(',', 1)

  data = base64.b64decode(encoded)
  image = Image.open(BytesIO(data))
  image.save(filename, format="JPEG")

  shutil.copy(filename, f".storage/{filename}")

prompt = input()
flux_image(prompt, "hal9-flux.jpg")