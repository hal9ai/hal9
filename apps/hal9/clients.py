from openai import OpenAI

# OpenAI Client
openai_client = OpenAI(
    base_url="https://api.hal9.com/proxy/server=https://api.openai.com/v1/",
    api_key = "hal9"
)

# Groq Client
groq_client = OpenAI(
    base_url="http://api.hal9.com/proxy/server=https://api.groq.com/openai/v1",
    api_key = "hal9"
)