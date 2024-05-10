import requests
import time
import tempfile
import sys
import runpy

def deploy(path :str, target :str) -> str:
    """Deploy an application

    Parameters
    ----------
    path : str 
            Path to the application.
    target : str 
            The deployment target, defaults to 'hal9.com'.
    """

    response = requests.post('https://api.hal9.com/api/v1/deploy', json = {
        'name': 'name',
        'title': 'title',
        'description': 'description',
        'access': 'access',
        'code': 'code',
        'prompt': 'prompt',
        'thumbnail': 'thumbnail',
        'token': 'token',
        'user': 'user',
    })

    if not response.ok:
        print('Failed to deploy')
        exit()