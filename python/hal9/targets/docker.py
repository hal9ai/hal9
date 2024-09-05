import shutil
from pathlib import Path

def deploy(path :str, url :str, name :str, typename :str, access :str, main :str, title :str, description :str) -> str:
    package_dir = Path(__file__).parent.parent
    source_path = package_dir / 'templates' / 'docker' / 'Dockerfile'
    destination_path = Path(path) / 'Dockerfile'

    print(f'Copying {source_path} to {destination_path}')
    shutil.copy(source_path, destination_path)
