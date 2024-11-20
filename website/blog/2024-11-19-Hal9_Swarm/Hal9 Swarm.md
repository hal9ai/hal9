**Using OpenAI Swarm with Hal9: Unlocking New Potential for Enterprise AI**

As enterprises seek innovative ways to harness the power of AI, combining the best tools for flexibility, speed, and collaborative insights becomes essential. OpenAI Swarm is a promising approach that leverages multiple instances of AI models working together in a coordinated manner, effectively mimicking a "swarm intelligence" system. When paired with Hal9—a platform optimized for customizing and deploying generative AI—OpenAI Swarm opens new horizons for enterprise-level solutions.

In this post, we’ll dive into what OpenAI Swarm is, why it’s a valuable asset for enterprise use, and how integrating it with Hal9 can transform your AI-driven applications. We'll also walk through some example code and provide visuals generated with this integration.

**What is OpenAI Swarm?**

OpenAI Swarm is a system designed to run multiple AI models in parallel, each contributing to a collective response based on the input provided. By orchestrating a “swarm” of AI models that analyze the same prompt from various perspectives, OpenAI Swarm generates richer, more nuanced responses. This can be incredibly useful for applications requiring deep analytical insights, creative brainstorming, or decision-making in complex scenarios.

**Why Use OpenAI Swarm with Hal9?**

Hal9 makes it simple for businesses to customize and deploy AI models at scale. By integrating OpenAI Swarm with Hal9, enterprises can harness the combined power of multiple AI models tailored specifically for their unique needs. This setup is especially advantageous in scenarios where a single model may not capture the full spectrum of insights required.

**Code:**

import json

import hal9 as h9

from dotenv import load\_dotenv

from swarm import Swarm, Agent, repl

from recomendations import book\_recommendation, comic\_recommendation, movie\_recommendation

load\_dotenv()

def transfer\_to\_receptionist():

`    `return receptionist

def transfer\_to\_book\_expert():

`    `return book\_expert

def transfer\_to\_comic\_expert():

`    `return comic\_expert

def transfer\_to\_movie\_expert():

`    `return movie\_expert

book\_expert = Agent(

`    `name="Book Expert",

`    `instructions="You are classic books expert, your task is to create book recommendations for the user. If the conversation drifts away from books, return to the receptionist.",

`    `functions=[book\_recommendation, transfer\_to\_receptionist],

)

comic\_expert = Agent(

`    `name="Comic Expert",

`    `instructions="You are an expert in comics, your task is to create comic recommendations for the user. If the conversation drifts away from comics, return to the receptionist.",

`    `functions=[comic\_recommendation, transfer\_to\_receptionist],

)

movie\_expert = Agent(

`    `name="Movie Expert",

`    `instructions="You are an expert in movies, your task is to create movie recommendations for the user. If the conversation drifts away from movies, return to the receptionist.",

`    `functions=[movie\_recommendation, transfer\_to\_receptionist],

)

receptionist = Agent(

`    `name="Receptionist",

`    `instructions="You are a receptionist in a pop culture center. Your task is to figure out if the user would like a random book, comic or movie recommendation.",

`    `functions=[transfer\_to\_book\_expert, transfer\_to\_comic\_expert, transfer\_to\_movie\_expert],

)

client = Swarm()

messages = h9.load('messages', [])

agents = {'Receptionist': receptionist,

`          `'Comic Expert': comic\_expert,

`          `'Movie Expert': movie\_expert}

agent = agents[h9.load('last\_agent', 'Receptionist')]    

user\_input = input()

messages.append({"role": "user", "content": user\_input})

response = client.run(

`    `agent=agent,

`    `messages=messages

)

for message in response.messages:

`    `if message["role"] != "assistant":

`        `continue

`    `print(f"{message['sender']}: ", end=" ")

`    `if message["content"]:

`        `print(message["content"], end = '\n\n')

`    `tool\_calls = message.get("tool\_calls") or []

`    `if len(tool\_calls) > 1:

`        `print('\n\n')

`    `for tool\_call in tool\_calls:

`        `f = tool\_call["function"]

`        `name, args = f["name"], f["arguments"]

`        `arg\_str = json.dumps(json.loads(args)).replace(":", "=")

`        `print(f"calling {name}({arg\_str[1:-1]}) ...", end = '\n\n')

messages.extend(response.messages)

agent = response.agent

h9.save('messages', messages, hidden = True)

h9.save('last\_agent', agent.name, hidden = True)

**Code Explanation**

This code is a recommendation system using a "swarm" of AI agents on the Hal9 platform, each specializing in a category: books, comics, or movies.

- **Agents**: There are four agents: receptionist, book\_expert, comic\_expert, and movie\_expert. The receptionist determines the user’s interest and directs them to the appropriate expert.
- **Functionality**: Each expert agent provides recommendations in its domain, and if the conversation shifts away, it returns control to the receptionist.
- **Session Management**: The code maintains conversation history and the last active agent, enabling smooth, continuous interactions.
- **Execution**: The system takes user input, selects the relevant agent, generates a response, and logs any tool (function) calls made for recommendations.

This setup allows for interactive, specialized recommendations that adapt to user preferences in real-time.

**Sample Conversation**

![](Aspose.Words.71c44a0c-1802-452f-8239-e78f8287d86b.001.png)
