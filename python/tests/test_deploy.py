import json
import os
import tempfile
from unittest.mock import MagicMock, patch

import pytest

import hal9 as h9

def test_deploy_is_exported():
  assert callable(h9.deploy)

def test_deploy_to_hal9_server():
  with tempfile.TemporaryDirectory() as path:
    with open(os.path.join(path, "app.py"), "w") as f:
      f.write("print('hello')\n")

    mock_response = MagicMock()
    mock_response.ok = True
    mock_response.json.return_value = {"url": "https://hal9.com/apps/test"}

    with patch.dict(os.environ, {"HAL9_TOKEN": "test-token"}):
      with patch("hal9.targets.hal9.requests.post", return_value=mock_response) as mock_post:
        url = h9.deploy(path, name="test-app")

    assert url == "https://hal9.com/apps/test"
    mock_post.assert_called_once()
    assert mock_post.call_args.args[0] == "https://api.hal9.com/api/v1/assets/upload"
    assert mock_post.call_args.kwargs["headers"]["ApiKey"] == "test-token"
    payload = json.loads(mock_post.call_args.kwargs["data"])
    assert payload["name"] == "test-app"
    assert payload["filename"] == "app.py"
    assert payload["type"] == "ability"
    assert payload["access"] == "private"
    assert "app.py" in payload["files"]

def test_deploy_without_args_uses_hal9_server():
  with tempfile.TemporaryDirectory() as path:
    with open(os.path.join(path, "app.py"), "w") as f:
      f.write("print('hello')\n")

    mock_response = MagicMock()
    mock_response.ok = True
    mock_response.json.return_value = {"url": "https://hal9.com/apps/test"}

    cwd = os.getcwd()
    try:
      os.chdir(path)
      with patch.dict(os.environ, {"HAL9_TOKEN": "test-token"}):
        with patch("hal9.targets.hal9.requests.post", return_value=mock_response) as mock_post:
          url = h9.deploy()
    finally:
      os.chdir(cwd)

    assert url == "https://hal9.com/apps/test"
    assert mock_post.call_args.args[0] == "https://api.hal9.com/api/v1/assets/upload"
    payload = json.loads(mock_post.call_args.kwargs["data"])
    assert payload["name"].startswith(os.path.basename(path))

def test_deploy_requires_hal9_token():
  with tempfile.TemporaryDirectory() as path:
    with patch.dict(os.environ):
      os.environ.pop("HAL9_TOKEN", None)
      with pytest.raises(Exception, match="HAL9_TOKEN"):
        h9.deploy(path)

def test_deploy_unsupported_target():
  with pytest.raises(Exception, match="unsupported"):
    h9.deploy(".", target="nowhere")

def test_deploy_docker_target():
  with tempfile.TemporaryDirectory() as path:
    h9.deploy(path, target="docker")
    assert os.path.exists(os.path.join(path, "Dockerfile"))
