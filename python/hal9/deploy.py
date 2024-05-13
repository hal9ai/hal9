from hal9.targets.docker import deploy as deploy_docker

targets = {
    'docker': deploy_docker,
}

def deploy(path :str, target :str) -> str:
    """Deploy an application

    Parameters
    ----------
    path : str 
            Path to the application.
    target : str 
            The deployment target, defaults to 'hal9.com'.
    """

    if target in targets:
        targets[target](path)
    else:
        raise Exception(f"Deployment target '{target}' is unsupported.")
