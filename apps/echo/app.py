
with open('prompt.txt', 'r') as file:
  template = file.read()

prompt = input()
message = template.format(prompt = prompt)

print(message)
