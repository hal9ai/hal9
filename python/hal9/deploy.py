from hal9.targets.docker import deploy as deploy_docker
from hal9.targets.hal9 import deploy as deploy_hal9

targets = {
    'docker': deploy_docker,
    'hal9': deploy_hal9,
}

def deploy(path :str, target :str, url :str) -> str:
    """Deploy an application

    Parameters
    ----------
    path : str 
            Path to the application.
    target : str 
            The deployment target, defaults to 'hal9.com'.
    """

    if target in targets:
        targets[target](path, url)
    else:
        raise Exception(f"Deployment target '{target}' is unsupported.")
