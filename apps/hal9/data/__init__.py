import os

def load_data():
    data = {}
    base_path = os.path.dirname(__file__)
    for file_name in os.listdir(base_path):
        if file_name.endswith(".txt"):
            data_name = os.path.splitext(file_name)[0]
            with open(os.path.join(base_path, file_name), 'r') as file:
                data[data_name] = file.read()
    return data

DATA = load_data()