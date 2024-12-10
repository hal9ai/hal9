import shutil
import replicate
from utils import generate_response, load_messages, insert_message, execute_function, save_messages, insert_tool_message, load_json_file
from PIL import Image
from io import BytesIO
from clients import azure_openai_client
import os
import base64
from mimetypes import guess_type
import json

########################### Functions ##########################

def add_images_descriptions(image_path):
    description = generate_description(image_path)

    file_name = './.storage/.images_description.json'

    if os.path.exists(file_name):
        with open(file_name, 'r') as file:
            data = json.load(file)
    else:
        data = []

    new_record = {
        "image_path": image_path,
        "image_description": description
    }

    data.append(new_record)

    with open(file_name, 'w') as file:
        json.dump(data, file, indent=4)

    return description

def generate_img_url(image_path):
    mime_type, _ = guess_type(image_path)
    if mime_type is None:
        mime_type = 'application/octet-stream'

    with open(image_path, "rb") as image_file:
        base64_encoded_data = base64.b64encode(image_file.read()).decode('utf-8')

    return f"data:{mime_type};base64,{base64_encoded_data}"

def generate_description(image_path):
    try:
        file_input = open(image_path, 'rb')
        input = {
            "image": file_input,
            "prompt": """Generate a detailed image prompt that includes all specific visual details in the image. This should include precise descriptions of colors, textures, lighting, positions of all elements, proportions, background details, 
            foreground details, and any unique stylistic choices. Ensure the description is exhaustive enough to allow an artist or AI to recreate the image accurately without visual reference."""
        }

        description = ""
        for event in replicate.stream(
            "yorickvp/llava-13b:80537f9eead1a5bfa72d5ac6ea6414379be41d4d4f6679fd776e9535d1eb58bb",
            input=input
        ):
          description+=event.data
        file_input.close()
    except Exception as e: 
        return (f"Couldn't describe that image. -> Error: {e}")
    
    return description

def image_generator(prompt, filename):
    try:
      output = replicate.run("black-forest-labs/flux-dev", input={"prompt": prompt})
    except Exception as e:
      return (f"Couldn't generate that image. Please try a different prompt. -> Error: {e}")

    encoded_image = output[0].read()
    image = Image.open(BytesIO(encoded_image))

    image.save(filename, format="JPEG")

    shutil.copy(filename, f".storage/{filename}")

    generated_description = add_images_descriptions(f".storage/{filename}")
    
    print(generated_description)
    return f"The image generated is: {generated_description} \n\n Saved in path: '.storage/{filename}'"

def image_analyzer(image_path, prompt):
    image_url = generate_img_url(image_path)
    response = azure_openai_client.chat.completions.create(
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

def edition_canny_model(image_path, modified_description, filename):
    try:
        file_input = open(image_path, 'rb')
        output = replicate.run(
        "black-forest-labs/flux-canny-pro",
        input={
            "steps": 50,
            "prompt": modified_description,
            "guidance": 30,
            "control_image": file_input,
            "output_format": "jpg",
            "safety_tolerance": 2,
            "prompt_upsampling": False
          }
        )
        file_input.close()
    except Exception as e: 
        return (f"Couldn't generate that image. Please try a different prompt. -> Error: {e}")
    encoded_image = output.read()
    image = Image.open(BytesIO(encoded_image))

    image.save(filename, format="JPEG")

    shutil.copy(filename, f".storage/{filename}")

    generated_description = add_images_descriptions(f".storage/{filename}")
    print(generated_description)
    return f"The image generated is: {generated_description} \n\n Saved in path: '.storage/{filename}'"
  
def edition_depth_model(image_path, modified_description, filename):
    try:
        file_input = open(image_path, 'rb')
        output = replicate.run("black-forest-labs/flux-depth-pro",
          input={
              "steps": 50,
              "prompt": modified_description,
              "guidance": 7,
              "control_image": file_input,
              "output_format": "jpg",
              "safety_tolerance": 2,
              "prompt_upsampling": False
          }
        )
        file_input.close()
    except Exception as e: 
        return (f"Couldn't generate that image. Please try a different prompt. -> Error: {e}")
    encoded_image = output.read()
    image = Image.open(BytesIO(encoded_image))

    image.save(filename, format="JPEG")

    shutil.copy(filename, f".storage/{filename}")

    generated_description = add_images_descriptions(f".storage/{filename}")
    print(generated_description)
    return f"The image generated is: {generated_description} \n\n Saved in path: '.storage/{filename}'"

def generate_image_variation(image_path, filename):
    try:
        file_input = open(image_path, 'rb')
        output = replicate.run(
            "black-forest-labs/flux-redux-dev",
            input={
                "guidance": 3,
                "megapixels": "1",
                "num_outputs": 4,
                "redux_image": file_input,
                "aspect_ratio": "21:9",
                "output_format": "webp",
                "output_quality": 80,
                "num_inference_steps": 28
            }
        )
        file_input.close()
    except Exception as e: 
        return (f"Couldn't generate that image. Please try a different prompt. -> Error: {e}")
    encoded_image = output[0].read()
    image = Image.open(BytesIO(encoded_image))

    image.save(filename, format="JPEG")

    shutil.copy(filename, f".storage/{filename}")

    generated_description = add_images_descriptions(f".storage/{filename}")
    print(generated_description)
    return f"The image generated is: {generated_description} \n\n Saved in path: '.storage/{filename}'"

########################### Descriptions ########################## 

image_generator_description = {
    "type": "function",
    "function": {
        "name": "image_generator",
        "description": "When the user requests an image, logo, or similar visual, this function generates a high-quality JPEG image based on a user-provided prompt. The user prompt can be enhanced to improve the image quality, but the core idea provided by the user will always needs to be preserved.",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "prompt": {
                    "type": "string",
                    "description": "An enhanced or more detailed version of the user's original prompt. This refined prompt retains the user's core idea but includes the necessary details or styles for the image generator to produce high-quality results.",
                },
               "filename": {
                    "type": "string",
                    "description": "Choose a name for the generated image file (including file extension).",
                },
            },
            "required": ["prompt", "filename"],
            "additionalProperties": False,
        },
    }
}

image_analyzer_description = {
    "type": "function",
    "function": {
        "name": "image_analyzer",
        "description": "Analyzes the content of an image and provides insights or answers based on a specified prompt.",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "image_path": {
                    "type": "string",
                    "description": "Path of the image to be analyzed."
                },
                "prompt": {
                    "type": "string",
                    "description": "A query or instruction about what to analyze in the image. Defaults to 'What's in this image?' if not provided."
                }
            },
            "required": ["image_path", "prompt"],
            "additionalProperties": False
        }
    }
}

edition_canny_model_description = {
    "type": "function",
    "function": {
        "name": "edition_canny_model",
        "description": "Generates a new version of an input image using Canny edge detection for structural guidance and a user-provided prompt.",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "image_path": {
                    "type": "string",
                    "description": "The file path of the input image to be processed using Canny edge detection."
                },
                "modified_description": {
                    "type": "string",
                    "description": "Based on the history description image modify it with the desired transformation or features to be applied to the image."
                },
                "filename": {
                    "type": "string",
                    "description": "The name (including extension) of the output image file."
                }
            },
            "required": ["image_path", "modified_description", "filename"],
            "additionalProperties": False
        }
    }
}

edition_depth_model_description = {
    "type": "function",
    "function": {
        "name": "edition_depth_model",
        "description": "Generates a new version of an input image using depth information as structural guidance and a user-provided prompt.",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "image_path": {
                    "type": "string",
                    "description": "The file path of the input image to be processed using depth-based structural guidance."
                },
                "modified_description": {
                    "type": "string",
                    "description": "Based on the history description image modify it with the desired transformation or features to be applied to the image."
                },
                "filename": {
                    "type": "string",
                    "description": "The name (including extension) of the output image file."
                }
            },
            "required": ["image_path", "modified_description", "filename"],
            "additionalProperties": False
        }
    }
}

generate_image_variation_description = {
    "type": "function",
    "function": {
        "name": "generate_image_variation",
        "description": "Creates variations of an input image by mixing its elements with new aspects using user-defined parameters.",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "image_path": {
                    "type": "string",
                    "description": "The file path of the input image to be used as a base for generating variations."
                },
                "filename": {
                    "type": "string",
                    "description": "The name (including extension) of the output image file."
                }
            },
            "required": ["image_path", "filename"],
            "additionalProperties": False
        }
    }
}

images_management_system_description = {
    "type": "function",
    "function": {
        "name": "images_management_system",
        "description": "Manages and processes image-related queries, enabling tasks such as generating new images, editing existing ones, analyzing image content, and creating variations. Interacting with images based on user queries.",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "user_query": {
                    "type": "string",
                    "description": "A query or instruction related to generating, editing, analyzing, or managing images."
                }
            },
            "required": ["user_query"],
            "additionalProperties": False
        }
    }
}

########################### Main Agent ############################

def images_management_system(user_query):
    tools_descriptions = [image_generator_description, image_analyzer_description, edition_canny_model_description, edition_depth_model_description, generate_image_variation_description]
    tools_functions = [image_generator, image_analyzer, edition_canny_model, edition_depth_model, generate_image_variation]

    # load messages
    messages = load_messages(file_path="./.storage/.images_agent_messages.json")
    image_descriptions = load_json_file("./.storage/.images_description.json")
    formatted_descriptions = "\n".join(
    [f"Path: {record['image_path']}, Description: {record['image_description']}" for record in image_descriptions]
)

    if len(messages) < 1:
        messages = insert_message(messages, "system", f"""You are a specialized image management system designed to process, analyze, and enhance images based on user queries. Your task is to interact with a range of tools, 
                                  each tailored for specific image-related tasks, to generate insights, create visuals, and apply transformations.

Available images are stored in various common formats and accessible via a path. Your actions should be precise and context-driven, ensuring user needs are met effectively.

Effective Tool Usage Recommendations:
1. Use the **image generator** for creating new visuals based on detailed prompts, ensuring high-quality results.
2. Leverage **image analyzer** to interpret the content of images or to answer specific questions about their context.
3. For image transformations:
   - Use **edition_canny_model** for structural edits guided by edge detection.
   - Use **edition_depth_model** for modifications driven by depth-based structural guidance.
4. Use **generate_image_variation** to create variations of an input image when requested.
""")
    messages = insert_message(messages, "user", f"Fullfill this request -> {user_query}, \n\n Current available images are:{formatted_descriptions}")

    response = generate_response("openai", "gpt-4-turbo", messages, tools_descriptions, tool_choice = "required", parallel_tool_calls=False)
    tool_result = execute_function(response, tools_functions)
    insert_tool_message(messages, response, tool_result)
    save_messages(messages, file_path="./.storage/.text_agent_messages.json")

    return tool_result