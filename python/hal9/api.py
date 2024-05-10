import requests
import time
import tempfile
import sys
import runpy

def create(path :str, template :str) -> str:
    """Create an application

    Parameters
    ----------
    path : str 
            Path to the application.
    template : str 
            The template to use.
    """

    print(f'Project created! {name}')

def run(path :str) -> str:
    """Run an application

    Parameters
    ----------
    path : str 
            Path to the application.
    """

    print(f'Project created! {name}')

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