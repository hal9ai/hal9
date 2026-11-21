from unittest.mock import patch

from click.testing import CliRunner

from hal9.cli import cli

def test_run_uses_default_source_and_type():
  calls = []

  with patch("hal9.cli.api_run", side_effect=lambda *args: calls.append(args)):
    result = CliRunner().invoke(cli, ["run", "chatbot"])

  assert result.exit_code == 0
  assert calls == [("chatbot", "app.py", "python", "8080", None)]

def test_deploy_reports_read_only_platform():
  result = CliRunner().invoke(cli, ["deploy", "."])

  assert result.exit_code == 1
  assert "read-only" in result.output
  assert "Cloudish" in result.output
