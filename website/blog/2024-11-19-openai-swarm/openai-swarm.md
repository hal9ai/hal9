--- 
slug: swarm-openai
title: "Using OpenAI Swarm with Hal9: Unlocking New Potential for Enterprise AI"
authors: [karan] 
tags: [Swarm, OpenAI]
description: "Explore the integration of OpenAI Swarm with Hal9 to
unlock innovative AI capabilities" 
image: https://hal9.com/docs/screenshots/blog-movie-recommendations-light.png
---

<head>
  <meta property="og:image" content="blog-movie-recommendations-light.png" />
</head>

import ThemedImage from '../../src/components/themedimg.jsx'

## Using OpenAI Swarm with Hal9: Unlocking New Potential for EnterpriseAI

As enterprises seek innovative ways to harness the power of AI,
combining the best tools for flexibility, speed, and collaborative
insights becomes essential. OpenAI Swarm is a promising approach that
leverages multiple instances of AI models working together in a
coordinated manner, effectively mimicking a "swarm intelligence"
system. When paired with Hal9---a platform optimized for customizing and
deploying generative AI---OpenAI Swarm opens new horizons for
enterprise-level solutions.

In this post, we'll dive into what OpenAI Swarm is, why it's a valuable
asset for enterprise use, and how integrating it with Hal9 can transform
your AI-driven applications. We'll also walk through some example code
and provide visuals generated with this integration.

### What is OpenAI Swarm?

OpenAI Swarm is a system designed to run multiple AI models in parallel,
each contributing to a collective response based on the input provided.
By orchestrating a "swarm" of AI models that analyze the same prompt
from various perspectives, OpenAI Swarm generates richer, more nuanced
responses. This can be incredibly useful for applications requiring deep
analytical insights, creative brainstorming, or decision-making in
complex scenarios.

### Why Use OpenAI Swarm with Hal9?

Hal9 makes it simple for businesses to customize and deploy AI models at
scale. By integrating OpenAI Swarm with Hal9, enterprises can harness
the combined power of multiple AI models tailored specifically for their
unique needs. This setup is especially advantageous in scenarios where a
single model may not capture the full spectrum of insights required.

### Example Code

```python 
import json
import hal9 as h9
from dotenv import load_dotenv
from swarm import Swarm, Agent, repl 
from recommendations import book_recommendation, comic_recommendation, movie_recommendation

load_dotenv()

#Define transfer functions 
def transfer_to_receptionist(): 
  return receptionist

def transfer_to_book_expert(): 
  return book_expert

def transfer_to_comic_expert(): 
  return comic_expert

def transfer_to_movie_expert(): 
  return movie_expert

# Define expert agents 
book_expert = Agent(
  name="Book Expert", 
  instructions="You are a classic books expert. Provide book recommendations. If the conversation drifts away, return to the receptionist.", 
  functions=[book_recommendation, transfer_to_receptionist])

comic_expert = Agent(
  name="Comic Expert", 
  instructions="You are an expert in comics. Provide comic recommendations. If the conversation drifts away, return to the receptionist.", 
  functions=[comic_recommendation, transfer_to_receptionist])

movie_expert = Agent(
  name="Movie Expert", 
  instructions="You are an expert in movies. Provide movie recommendations. If the conversation drifts away, return to the receptionist.",
  functions=[movie_recommendation, transfer_to_receptionist])

receptionist = Agent(
  name="Receptionist", 
  instructions="You are a receptionist. Direct users to a book, comic, or movie expert based on their input.", 
  functions=[transfer_to_book_expert, transfer_to_comic_expert, transfer_to_movie_expert])

client = Swarm() 
messages = h9.load('messages', []) 
agents = {'Receptionist': receptionist, 
          'Comic Expert': comic_expert, 
          'Movie Expert': movie_expert} 
agent = agents[h9.load('last_agent', 'Receptionist')]

# Handle user input 
user_input = input() 
messages.append({"role": "user", "content": user_input})

response = client.run(agent=agent, messages=messages)

for message in response.messages: 
  if message["role"] == "assistant": 
    print(f"{message['sender']}: {message['content']}")

  messages.extend(response.messages) agent = response.agent

h9.save('messages', messages, hidden=True) 
h9.save('last_agent', agent.name, hidden=True)
```

## Code Explanation

This code is a recommendation system using a "swarm" of AI agents on the Hal9 platform, each specializing in a category: books, comics, or movies.

- **Agents:** There are four agents: receptionist, book_expert, comic_expert, and movie_expert. The receptionist determines the user’s interest and directs them to the appropriate expert.

- **Functionality:** Each expert agent provides recommendations in its domain, and if the conversation shifts away, it returns control to the receptionist.

- **Session Management:** The code maintains conversation history and the last active agent, enabling smooth, continuous interactions.

- **Execution:** The system takes user input, selects the relevant agent, generates a response, and logs any tool (function) calls made for recommendations.

This setup allows for interactive, specialized recommendations that adapt to user preferences in real-time.

## Sample Conversation
<center><a href="https://hal9.com/demos/swarm"><ThemedImage src="blog-movie-recommendations"/></a></center>
