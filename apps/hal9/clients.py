from openai import AzureOpenAI, OpenAI
import os

# Azure - OpenAI (gpt-4)
azure_openai_client = AzureOpenAI(
    azure_endpoint = 'https://openai-hal9.openai.azure.com/',
    api_key = os.environ['OPENAI_AZURE'],
    api_version = '2024-10-01-preview',
)

# o1 Client
openai_client = OpenAI(
    base_url="https://api.hal9.com/proxy/server=https://api.openai.com/v1/",
    api_key = "hal9"
)