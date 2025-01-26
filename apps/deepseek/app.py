from openai import OpenAI
import hal9 as h9

client = OpenAI(api_key = "placeholder", base_url = "https://api.hal9.com/proxy/server=https://api.deepseek.com")

messages = h9.load("messages", [ {"role": "system", "content": "You are a helpful assistant"} ])
messages.append({"role": "user", "content": input()})

completion = client.chat.completions.create(model = "deepseek-reasoner", messages = messages, stream = True)

response = ""
print("Thinking...\n")
for chunk in completion:
  if len(chunk.choices) > 0:
    delta = chunk.choices[0].delta
    if delta.reasoning_content is not None and delta.reasoning_content:
      print(delta.reasoning_content, end="")
    elif delta.content is not None:
      if response == "":
        print("\n\n---\n\n")
      print(delta.content, end="")
      response += delta.content

messages.append({"role": "assistant", "content": response})
h9.save("messages", messages, hidden = True)