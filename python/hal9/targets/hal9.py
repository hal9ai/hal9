import requests
import os
import tempfile
import zipfile
from pathlib import Path
import time
import base64
import json

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

def read_files(path):
    files_dict = {}
    
    for root, dirs, files in os.walk(path):
        for file in files:
            file_path = os.path.join(root, file)
            with open(file_path, 'rb') as f:
                encoded_content = base64.b64encode(f.read()).decode('utf-8')
                files_dict[file] = encoded_content
    
    return files_dict

def request_deploy(path :str, url :str, name :str, typename :str, data :str) -> str:
    project_name = project_from_path(path)
    zip_path = create_deployment(path)

    unixtime = int(time.time())

    with open(zip_path, 'rb') as file:
        file_content = file.read()
        encoded_content = base64.b64encode(file_content).decode('utf-8')
        upload_name = f'{project_name}-{unixtime}.zip'

    # use app.py until backend supports zip content
    with open(Path(path) / 'app.py', 'rb') as file:
        file_content = file.read()
        encoded_content = base64.b64encode(file_content).decode('utf-8')
        upload_name = f'app.py'

    payload = {
        'filename': upload_name,
        'type': typename,
        'name': name,
        'format': 'b64',
        'files': read_files(path),
        'schemapath': data,
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

def deploy(path :str, url :str, name :str, typename :str, data :str) -> str:
    if 'HAL9_TOKEN' in os.environ:
        hal9_token = os.environ['HAL9_TOKEN']
    else:
        exit(f'HAL9_TOKEN environment variable missing, see https://hal9.com/deploy')
        # hal9_token = browser_login()

    request_deploy(path, url, name, typename, data)

