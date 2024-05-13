import requests

def deploy(path :str) -> str:
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

    return