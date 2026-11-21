import os
import tempfile

import pytest

import hal9 as h9

def test_deploy_is_exported():
  assert callable(h9.deploy)

def test_deploy_to_hal9_is_disabled():
  with pytest.raises(Exception, match="read-only"):
    h9.deploy(".")

def test_deploy_without_args_is_disabled():
  with pytest.raises(Exception, match="Cloudish"):
    h9.deploy()

def test_deploy_unsupported_target():
  with pytest.raises(Exception, match="unsupported"):
    h9.deploy(".", target="nowhere")

def test_deploy_docker_target():
  with tempfile.TemporaryDirectory() as path:
    h9.deploy(path, target="docker")
    assert os.path.exists(os.path.join(path, "Dockerfile"))
