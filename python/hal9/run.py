import requests
import time
import tempfile
import sys
import runpy

def run(path :str) -> str:
    """Run an application

    Parameters
    ----------
    path : str 
            Path to the application.
    """

    print(f'Running...')
