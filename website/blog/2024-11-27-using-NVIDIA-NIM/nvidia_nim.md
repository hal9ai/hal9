---
slug: nvidia-nim
title: "Using NVIDIA NIM to Spot AI-Generated Images" 
authors: [diego]
tags: [NVIDIA, NIM, AI Detection]
image: https://hal9.com/docs/screenshots/blog-nvidia-nim-light.png
---

<head>
  <meta property="og:image" content="blog-nvidia-nim-light.png" />
</head>

import ThemedImage from '../../src/components/themedimg.jsx'

AI-generated images are proliferating across the internet, manifesting in various forms of art, brand representation, and even fake news. These images, created using sophisticated machine learning algorithms, often blur the lines between authentic and artificial content, presenting themselves as both opportunities and challenges. To overcome these challenges, tools designed to identify AI-generated images, such as some available at [NVIDIA NIM](https://developer.nvidia.com/nim), are becoming increasingly vital for both businesses and individuals.

In this blog post, we aim to answer a simple question: How simple is it to create an application that detects AI-generated images using Hal9? The answer is that, writing just a few lines of Python code and by utilizing Hal9’s infrastructure empowered with NVIDIA NIM’s API, you can swiftly develop a robust tool capable of identifying both deepfakes and AI-generated images.

### Why Choose Hal9 for Deploying AI Applications?
Hal9 is designed to simplify the deployment of AI-powered tools and applications, making advanced technologies accessible to businesses and developers. Whether you’re looking to create a chatbot, build a custom app, or integrate AI functionalities into your website, Hal9 offers a streamlined approach that reduces development overhead and maximizes scalability.

Some key advantages of using Hal9 include:
- Ease of Deployment: Hal9’s infrastructure makes it possible to bring AI models and applications online quickly, without needing extensive backend setup.

- On-Demand Functionality: From chatbots to analytics tools, Hal9 supports dynamic, user-driven interactions that can be scaled to meet diverse needs.

- Versatility: Whether you’re deploying simple chatbots or more complex applications leveraging external APIs like NVIDIA NIM, Hal9 provides the flexibility to adapt to your project requirements.

By leveraging Hal9, you can focus on building impactful AI solutions while relying on their robust infrastructure to handle the heavy lifting.

### A Practical Example: Detecting AI-Generated Images
With the surge of AI-generated content flooding the internet—whether in the form of art, advertisements, or even misinformation—there’s an increasing need for tools that can reliably detect these creations. This challenge isn’t just academic; it impacts industries ranging from media and marketing to cybersecurity.

To showcase how easy it is to deploy an AI application with Hal9, we decided to build a tool that detects AI-generated images. This example not only highlights the simplicity of using NVIDIA NIM’s models but also demonstrates how Hal9’s deployment framework enables you to bring advanced AI solutions directly to your audience, whether for content verification, compliance, or user engagement.

### Building the AI-Generated Image Detection Tool
To build our AI-generated image detection tool, we used two Python scripts:
- A main script that contains all the logic for interacting with the NVIDIA NIM API.

- A user interface handler script that processes user-submitted URLs and sends them to the main script for analysis.

#### Main Script: Connecting to the NVIDIA NIM API
This script implements the core logic for querying the NVIDIA NIM model to detect whether an image is AI-generated. The implementation was adapted from example code provided by NVIDIA, demonstrating how to use their API effectively.

```Python 
import os
import base64
import requests

from openai import OpenAI
from dotenv import load_dotenv
from image_reading import get_image_data

# Load environment variables from the .env file
load_dotenv()

# Set up authentication headers using the NVIDIA API key
header_auth = f"Bearer {os.getenv('NVIDIA_API_KEY')}"
client = OpenAI(
    base_url = "https://integrate.api.nvidia.com/v1",
    api_key = os.getenv('NVIDIA_API_KEY')
)

# Function to upload an image asset to NVIDIA's servers if it's too large
def upload_asset(binary):
    assets_url = "https://api.nvcf.nvidia.com/v2/nvcf/assets"
    headers = {
        "Content-Type": "application/json",  # Set the content type to JSON
        "Authorization": header_auth,  # Authentication using the NVIDIA API key
        "accept": "application/json",
    }

    payload = {"contentType": "image/png", "description": "Input Image"}
    # Send a request to get the pre-signed URL for uploading the image
    response = requests.post(assets_url, headers=headers, json=payload, timeout=30)

    current_pre_signed_url = response.json()["uploadUrl"]

    headers = {"Content-Type": "image/png", "x-amz-meta-nvcf-asset-description": "Input Image"}

    # Upload the image to the pre-signed URL
    requests.put(
        current_pre_signed_url,
        data=binary,
        headers=headers,
        timeout=300,
    )

    # Return the asset ID for further use in AI detection
    return response.json()["assetId"]

# Function to check if the provided image URL points to an AI-generated image
def is_ai_generated(image_url):
    binary = get_image_data(image_url)

    # Check if the binary data is empty (error in image retrieval)
    # If empty, the user has already been notified of the error
    if not binary:
        return
    
    # Encode the image in base64 format for API consumption
    b64 = base64.b64encode(binary).decode('utf-8')
    
    # If the image is small enough, send it as base64 encoded data
    if len(b64) < 180_000:
        payload = {"input": [f"data:image/png;base64,{b64}"]}
        headers = {
            "Content-Type": "application/json",
            "Authorization": header_auth,
            "Accept": "application/json",
        }
    else:
        # If the image is large, upload it as an asset first
        asset_id = upload_asset(binary)
        payload = {"input": [f"data:image/png;asset_id,{asset_id}"]}
        headers = {
            "Content-Type": "application/json",
            "NVCF-INPUT-ASSET-REFERENCES": asset_id,
            "Authorization": header_auth,
        }
    
    # Send the request to NVIDIA's AI-generated image detection API
    response = requests.post(
        "https://ai.api.nvidia.com/v1/cv/hive/ai-generated-image-detection", 
        headers=headers, 
        json=payload).json()['data'][0]

    # If the API call was successful, process the response
    if response.get('status', '') == 'SUCCESS':
        # Sort the possible sources of the image by likelihood and display the top 5
        possible_sources = sorted(response["possible_sources"].items(), key = lambda item: -item[1])[:5]
        possible_sources = [f'{k.title()}: {v*100:.2f}%' for k,v in possible_sources]

        # Output the results to the user
        print(f'Probability of being AI-generated: {response["is_ai_generated"]*100:.4f}%') 
        print('\nPossible sources: ', *possible_sources, sep = '\n - ')
    else:
        print('There was an error processing the image, please try again.')

# Main function to take user input and start the detection process
if __name__ == '__main__':
    url = input()  # Prompt the user for an image URL
    is_ai_generated(url)  # Call the AI detection function
```

#### User Interface Handler: Managing User Input
This second script is a lightweight interface to collect user-submitted URLs, validate them, and pass them to the main script.

```Python
import requests

# Function to check if the user uploaded a valid and accessible image URL.
def is_image_url(url: str) -> bool:
    try:
        # Send a HEAD request to only retrieve the headers for the URL, to avoid downloading the image.
        headers = requests.head(url).headers
    except Exception as e:
        print(f'Please input a valid URL! {e}')
        return False
    
    # Check if the user uploaded a valid image file format
    valid_formats = ('.jpg', '.png', '.jpeg')
    
    # Check for specific URL format and valid image extensions
    if (url.startswith('https://prodhal9.s3.us-west-2.amazonaws.com/') and url.endswith(valid_formats)):
        return True
    
    # Ensure the content type is an image
    elif not headers.get('Content-Type', '').startswith('image/'):
        print('Please upload a link to a valid image!')
        return False
    
    # Ensure the image file size is not too large (maximum 5 MB)
    elif int(headers.get('Content-Length', 0)) > 5*1024*1024:
        print('Images can only weigh up to 5 MB!')
        return False
    
    return True

# Function to retrieve the image data if the URL is valid
def get_image_data(url: str) -> str:
    # Validate the image URL before proceeding
    if not is_image_url(url):
        return ''
    
    # Retrieve the image content via a GET request
    response = requests.get(url)
    # Check if the image URL is publicly accessible
    if not response.status_code == 200:
        print('Please upload a publicly accessible URL!')
        return ''
    
    # Return the binary content of the image file
    return response.content
```

### Try It Yourself
Curious to see how it works? We’ve hosted our AI-detecting chatbot on our website, so you can try it out for yourself! Just upload or link an image, and the chatbot will tell you if it’s AI-generated. [Click here to try our AI-Detecting Chatbot](https://hal9.com/demos/ai-detector)

<center><a href="https://hal9.com/demos/ai-detector"><ThemedImage src="blog-nvidia-nim"/></a></center>

### Conclusion
By combining NVIDIA NIM’s advanced AI capabilities with Hal9’s user-friendly deployment services, we were able to create and host an AI-generated image detection tool in no time. This example highlights not only the power of these platforms but also their accessibility for developers and businesses alike.

If you’re looking to bring AI-powered applications to your audience, Hal9 offers a versatile and scalable solution to turn your ideas into reality—whether it’s deploying chatbots, creating analysis tools, or, like in our case, detecting AI-generated images.


