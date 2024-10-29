import shutil
import replicate

from PIL import Image
from io import BytesIO

def flux_image(prompt, filename):
  try:
    output = replicate.run("black-forest-labs/flux-dev", input={"prompt": prompt})
  except Exception as e:
    print("Couldn't generate that image. Please try a different prompt.")
    print(f"Error: {e}")

  encoded_image = output[0].read()
  image = Image.open(BytesIO(encoded_image))
  image.save(filename, format="JPEG")

  shutil.copy(filename, f".storage/{filename}")

prompt = input()
flux_image(prompt, "hal9-flux.jpg")