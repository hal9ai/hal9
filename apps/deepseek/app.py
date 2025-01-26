from openai import OpenAI

client = OpenAI(
  api_key="hal9",
  base_url="https://api.hal9.com/proxy/server=https://api.deepseek.com")

stream = client.chat.completions.create(
    model="deepseek-reasoner",
    messages=[
        {"role": "system", "content": "You are a helpful assistant"},
        {"role": "user", "content": input()},
    ],
    stream=True
)

for chunk in stream:
  if len(chunk.choices) > 0:
    if chunk.choices[0].delta.reasoning_content is not None and chunk.choices[0].delta.reasoning_content:
      print(chunk.choices[0].delta.reasoning_content, end="")
    elif chunk.choices[0].delta.content is not None:
      print(chunk.choices[0].delta.content, end="")
