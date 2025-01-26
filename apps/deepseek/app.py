from openai import OpenAI

client = OpenAI(
  api_key="hal9",
  base_url="http://localhost:5000/proxy/server=https://api.deepseek.com")

stream = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": "You are a helpful assistant"},
        {"role": "user", "content": input()},
    ],
    stream=True
)

for chunk in stream:
  if len(chunk.choices) > 0 and chunk.choices[0].delta.content is not None: 
    print(chunk.choices[0].delta.content, end="")