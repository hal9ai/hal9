import requests
import time
import tempfile
import sys
import runpy

def create(template :str) -> str:
    """Create an app for the given template

    Parameters
    ----------
    template : str 
            The template to use to create the project.
    """

def deploy(project :str, destination :str) -> str:
    """Deploy project to given destination

    Parameters
    ----------
    project : str 
            The project name used to deploy the app.
    destination : str 
            The deployment destination, defaults to Hal9.
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