import requests
import time
import tempfile
import streamlit.web.bootstrap
def get_app(prompt :str) -> str:
    """Generate an app using that does what the prompt says

    Parameters
    ----------
    prompt : str 
            The prompt that you want the app to achieve.
    """
    response = requests.post('https://api.hal9.com/api/generator', json = {
        'prompt': prompt
    })
    while not response.ok:
        response = requests.post('https://api.hal9.com/api/generator', json = {
        'prompt': prompt
    })
    task_id = response.json()['taskid']
    r = requests.get('https://api.hal9.com/api/generator/'+ str(task_id))
    print('Loading your app..')
    if r.ok:
        while not r.json()['ready']:
            time.sleep(3)
            r = requests.get('https://api.hal9.com/api/generator/'+ str(task_id))
    apps =r.json()['apps']
    code = apps[0]['code']
    with tempfile.NamedTemporaryFile(mode = "w+", prefix = 'st_app', suffix='.py') as tmp:
        tmp.write(code)
        tmp.seek(0)
        streamlit.web.bootstrap.run(tmp.name, command_line = None, args =[], flag_options = {})
