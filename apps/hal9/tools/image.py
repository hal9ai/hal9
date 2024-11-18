from PIL import Image
from io import BytesIO
import shutil
import replicate

def create_image(prompt):
  """
  Creates an image or photograph for the user
    'prompt' with the description of the image or photograph
  """
  filename = "hal9-flux.jpg"
  try:
    output = replicate.run("black-forest-labs/flux-dev", input={"prompt": prompt})
    encoded_image = output[0].read()
    image = Image.open(BytesIO(encoded_image))

    image.save(filename, format="JPEG")

    shutil.copy(filename, f".storage/{filename}")

    return f"Generated a {filename} that {prompt}"
  except Exception as e:
    return f"Couldn't generate that image. Please try a different prompt. \n\n Error: {e}"