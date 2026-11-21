---
sidebar_position: 6
---

# Generating Images

To generate images, you can use [stable diffusion](../genai/sd.md) techniques with models like DallE, Flux, etc.

## Flux

```python
import os
import requests
from replicate import Client

from PIL import Image
from io import BytesIO
import shutil

replicate = Client(api_token=os.environ['REPLICATE_API_TOKEN'])

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

Set your Replicate token before running:

```bash
export REPLICATE_API_TOKEN=YOUR_REPLICATE_TOKEN
```

When you deploy this app to Cloudish, add `REPLICATE_API_TOKEN` as a secret and attach a volume if you want the generated images to survive restarts. See [Deployment](deployment.md).
