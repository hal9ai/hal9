---
sidebar_position: 6
---

# Generating Images

To generate images, you can use [stable diffusion](../genai/sd.md) techniques with models like DallE, Flux, etc.

## Flux

```python deploy
import os
import requests
from replicate import Client

from PIL import Image
from io import BytesIO
import shutil

replicate = Client(api_token="any", base_url="http://localhost:5000/proxy/server=https://api.replicate.com")

def flux_image(prompt, filename):
  output = replicate.run("black-forest-labs/flux-dev", input={"prompt": prompt})
    
  response = requests.get(output[0])
  response.raise_for_status()

  image = Image.open(BytesIO(response.content))
  image.save(filename, format="JPEG")
  shutil.copy(filename, f".storage/{filename}")

prompt = input()
flux_image(prompt, "hal9-flux.jpg")
```

You can try this from [hal9.com/apps/flux](https://hal9.com/apps/flux).
