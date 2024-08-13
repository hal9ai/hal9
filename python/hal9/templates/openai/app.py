from openai import OpenAI
import hal9 as h9

messages = h9.load("messages", [])
prompt = h9.input(messages = messages)

completions = OpenAI().chat.completions.create(model = "gpt-4", messages = messages, stream = True)

h9.complete(completions, messages = messages)
h9.save("messages", messages, hidden = True)