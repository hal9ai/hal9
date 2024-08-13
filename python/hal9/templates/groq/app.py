from groq import Groq
import hal9 as h9

messages = h9.load("messages", [])
prompt = h9.input(messages = messages)

completions = Groq().chat.completions.create(model = "llama3-70b-8192", messages = messages, stream = True)

h9.complete(completions, messages = messages)
h9.save("messages", messages, hidden = True)
