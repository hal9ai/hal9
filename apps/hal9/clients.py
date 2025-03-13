from openai import OpenAI
import os

# OpenAI Client
openai_client = OpenAI(
    base_url="https://api.hal9.com/proxy/server=https://api.openai.com/v1/",
    api_key = os.environ['HAL9_TOKEN']
)

# Groq Client
groq_client = OpenAI(
    base_url="http://api.hal9.com/proxy/server=https://api.groq.com/openai/v1",
    api_key = os.environ['HAL9_TOKEN']
)