import json
import os

def event(name, details):
  events_file = '.storage/.events'

  if os.path.exists(events_file):
    with open(events_file, 'r') as file:
      events = json.load(file)
  else:
    events = []

  events.append({"name": name, "details": details})

  with open(events_file, 'w') as file:
    json.dump(events, file)
