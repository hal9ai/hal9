import requests
import os
import tempfile
import zipfile
from pathlib import Path
import time
import base64
import json
import base64
import mimetypes

def file_to_dataurl(file_path):
    if not file_path:
        return None
    if not os.path.exists(file_path):
        return None
    mime_type, _ = mimetypes.guess_type(file_path)
    if mime_type not in ['image/jpeg', 'image/png']:
        raise ValueError("Unsupported file type. Only JPEG and PNG are allowed.")
    
    # Read the file content in binary mode
    with open(file_path, 'rb') as file:
        file_data = file.read()
    base64_data = base64.b64encode(file_data).decode('utf-8')
    data_url = f"data:{mime_type};base64,{base64_data}"
    return data_url

def complete_filename(directory, filename):
    for file in os.listdir(directory):
        if file.startswith(filename):
            return os.path.abspath(os.path.join(directory, file))
    return None

def project_from_path(path :str) -> str:
    return os.path.basename(os.path.abspath(path))

def create_deployment(path :str) -> str:
    temp_dir = Path(tempfile.mkdtemp())
    zip_path = temp_dir / 'archive.zip'

    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(path):
            for file in files:
                file_path = os.path.join(root, file)
                zipf.write(file_path, os.path.relpath(file_path, path))
    
    return zip_path

def read_files(path :str, exclude :str = None):
    files_dict = {}
    for root, dirs, files in os.walk(path):
        dirs[:] = [d for d in dirs if not d.startswith('.') and d != '__pycache__']
        for file in files:
            if file.startswith('.') or (exclude and file.startswith(exclude)):
                continue
            relative_path = os.path.relpath(os.path.join(root, file), path)
            with open(os.path.join(root, file), 'rb') as f:
                encoded_content = base64.b64encode(f.read()).decode('utf-8')
                files_dict[relative_path] = encoded_content
    
    return files_dict

def request_deploy(path :str, url :str, name :str, typename :str, data :str, access :str, main :str, title :str, description :str) -> str:
    thumbnail = file_to_dataurl(complete_filename(path, "thumbnail."))

    payload = {
        'filename': main,
        'type': typename,
        'name': name,
        'format': 'b64',
        'files': read_files(path, "thumbnail."),
        'schemapath': data,
        'access': access,
        'sourcefile': main,
        'thumbnail': thumbnail,
        'title': title,
        'description': description
    }

    headers = {
        'Content-Type': 'application/json',
        'ApiKey': os.environ['HAL9_TOKEN'],
    }
    response = requests.post(url + '/api/v1/assets/upload', headers = headers, data = json.dumps(payload))
    
    if not response.ok:
        response.raise_for_status()

    response_data = response.json()
    print(response_data['url'])

def deploy(path :str, url :str, name :str, typename :str, data :str, access :str, main :str, title :str, description :str) -> str:
    if 'HAL9_TOKEN' in os.environ:
        hal9_token = os.environ['HAL9_TOKEN']
    else:
        exit(f'HAL9_TOKEN environment variable missing, see https://hal9.com/devs')
        # hal9_token = browser_login()

    request_deploy(path, url, name, typename, data, access, main, title, description)

