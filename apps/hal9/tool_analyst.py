import sys
import json
import os
import requests
import _tools_utils
import pandas as pd
import time

data_url = sys.argv[1]  
prompt = sys.argv[2] 
memory_path = os.environ['PWD'] + f"/dist/{sys.argv[8]}.json"
agentMemory = json.loads(sys.argv[9])

if not prompt:
    exit()

def download_csv(url, filename):
    response = requests.get(url)
    if response.status_code == 200:
        with open(filename, 'wb') as f:
            f.write(response.content)
        return True
    else:
        return False

if len(agentMemory) == 0:
    # Extract the name from the connection
    csv_name=data_url.rsplit('/', 1)[-1]

    # Temp download the csv file
    download_csv(data_url,csv_name)

    # Generate Openai FileObject
    file = _tools_utils.client.files.create(file=open(csv_name, "rb"),purpose='assistants')

    # Extract columns names and Dtypes
    df = pd.read_csv(csv_name)
    x = pd.DataFrame(df.dtypes).reset_index().rename({'index': 'column', 0: 'data type'}, axis='columns')
    x['data type'] = x['data type'].apply(lambda x: str(x))
    schema = x.to_json(orient='records', lines=True)

    # Remove the file already uploaded to OpenAI and schema extracted
    os.remove(csv_name)

    # Create the assistant provided with the CSV
    assistant = _tools_utils.client.beta.assistants.create(
        name="Data Analyst",
        description="""You are a experienced Data Analyst, equipped with the skills to process and analyze data from a CSV file using Python.
        You can interpret data, perform statistical analysis, and generate visual representations to provide insights saving plots as .PNG image""",
        instructions= f"""Consult the CSV file provided and thorught code make the respective dana analysis, take this advices:
        - Provide detailed insights and interpretations based on the analysis results
        - Use Python and its libraries (e.g., pandas, matplotlib, seaborn) to execute data manipulation, statistical analysis, and data visualization
        - Answer questions regarding the dataset, including summaries, correlations, trends, and anomalies""",
        model="gpt-4",
        tools=[{"type": "code_interpreter"}],
        file_ids=[file.id],)

    # Generate a Thread for the chat 
    thread = _tools_utils.client.beta.threads.create()

    # Data stored in the memory
    agentMemory = {
        "assistant_id": assistant.id,
        "thread_id": thread.id,
        "file_id": file.id,}

    # Save the memory
    with open(memory_path, "w") as json_file:
       json.dump(agentMemory, json_file)
    
else:
    # Retrieve the agent based on the ID
    assistant_retrieved =_tools_utils.client.beta.assistants.retrieve(agentMemory['assistant_id'])

# Add the prompt to the thread
message = _tools_utils.client.beta.threads.messages.create(
    thread_id= agentMemory['thread_id'],
    role="user",
    content=prompt,)

#Get the amount of messages in the thread 
messages = _tools_utils.client.beta.threads.messages.list(thread_id=agentMemory['thread_id'])
data = json.loads(messages.model_dump_json(indent=2))  # Load JSON data into a Python object
messages_count=len(data["data"])

# Execute the thread with the assistant
run = _tools_utils.client.beta.threads.runs.create(
    thread_id=agentMemory['thread_id'],
    assistant_id=agentMemory['assistant_id'])

time.sleep(5)

while True:
    # Retrieve the status of the run
    run = _tools_utils.client.beta.threads.runs.retrieve(
        thread_id=agentMemory['thread_id'],
        run_id=run.id,
    )

    status = run.status
    
    if status != "in_progress" and status != "queued":
        break

    time.sleep(10)

#Get all the messages
messages = _tools_utils.client.beta.threads.messages.list(thread_id=agentMemory['thread_id'])

data = json.loads(messages.model_dump_json(indent=2))  
new_message_count=len(data["data"]) - messages_count

for i in range(new_message_count):
    content = data['data'][i].get('content', [])
    for message in content:
        ### Image Generated
        if 'image_file' in message:
            file_id=message['image_file']['file_id']
            content = _tools_utils.client.files.content(file_id)
            image= content.write_to_file(f"image_{file_id}.png")
        ### Text Generated
        if 'text' in message:
            print(message['text']['value'])