def deploy(path :str, url :str, name :str, typename :str, data :str, access :str, main :str, title :str, description :str) -> str:
    """Deploy to the legacy Hal9 Platform.

    The Hal9 Platform is read-only and no longer accepts deployments.
    """
    raise Exception(
        'Deployment to the Hal9 Platform is no longer available because the platform is read-only. '
        'Deploy your app to Cloudish instead: https://cloudish.ai'
    )
