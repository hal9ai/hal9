from dotenv import load_dotenv
import hal9 as h9
import json
from openai import OpenAI
from swarm import Swarm, Agent

from recomendations import book_recommendation, comic_recommendation, movie_recommendation

load_dotenv()

def transfer_to_receptionist():
    return receptionist

def transfer_to_book_expert():
    return book_expert

def transfer_to_comic_expert():
    return comic_expert

def transfer_to_movie_expert():
    return movie_expert

book_expert = Agent(
    name="Book Expert",
    instructions="You are classic books expert, your task is to create book recommendations for the user. If the conversation drifts away from books, return to the receptionist.",
    functions=[book_recommendation, transfer_to_receptionist],
)

comic_expert = Agent(
    name="Comic Expert",
    instructions="You are an expert in comics, your task is to create comic recommendations for the user. If the conversation drifts away from comics, return to the receptionist.",
    functions=[comic_recommendation, transfer_to_receptionist],
)

movie_expert = Agent(
    name="Movie Expert",
    instructions="You are an expert in movies, your task is to create movie recommendations for the user. If the conversation drifts away from movies, return to the receptionist.",
    functions=[movie_recommendation, transfer_to_receptionist],
)

receptionist = Agent(
    name="Receptionist",
    instructions="You are a receptionist in a pop culture center. Your task is to figure out if the user would like a random book, comic or movie recommendation.",
    functions=[transfer_to_book_expert, transfer_to_comic_expert, transfer_to_movie_expert],
)

client = OpenAI(
    base_url="https://api.hal9.com/proxy/server=https://api.openai.com/v1/",
    api_key = "h9" 
)
swarm = Swarm(client = client)

messages = h9.load('messages', [])

agents = {'Receptionist': receptionist,
          'Comic Expert': comic_expert,
          'Movie Expert': movie_expert}
agent = agents[h9.load('last_agent', 'Receptionist')]
    
user_input = input()
messages.append({"role": "user", "content": user_input})

response = swarm.run(
    agent=agent,
    messages=messages
)

for message in response.messages:
    if message["role"] != "assistant":
        continue

    print(f"{message['sender']}: ", end=" ")

    if message["content"]:
        print(message["content"], end = '\n\n')

    tool_calls = message.get("tool_calls") or []
    if len(tool_calls) > 1:
        print('\n\n')

    for tool_call in tool_calls:
        f = tool_call["function"]
        name, args = f["name"], f["arguments"]
        arg_str = json.dumps(json.loads(args)).replace(":", "=")
        print(f"calling {name}({arg_str[1:-1]}) ...", end = '\n\n')

messages.extend(response.messages)
agent = response.agent

h9.save('messages', messages, hidden = True)
h9.save('last_agent', agent.name, hidden = True)