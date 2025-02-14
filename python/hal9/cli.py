import click
from collections import OrderedDict
from hal9.create import create as api_create
from hal9.run import run as api_run
from hal9.run import describe_runtimes as api_run_describe_runtimes
from hal9.describe import describe_content as api_run_describe_content
from hal9.deploy import deploy as api_deploy
import datetime
import os
import pkg_resources
import json

version = pkg_resources.get_distribution('hal9').version

@click.group()
@click.version_option(version=version)
def cli():
  """
  Create and Deploy Generative Applications

  Use this tool to create apps from templates that use Generative AI,
  run them locally and deploy them to the cloud.
  """
  pass

@click.command()
@click.argument('path')
@click.option('--template', default="echo", help='The project template')
def create(path :str, template :str):
  """
  Create Project

  --path: The path for the new project. Required argument.
  """
  api_create(path, template)

@click.command()
@click.argument('path')
@click.option('--source', default=None, help='Main source file')
@click.option('--type', default=None, help='Type of runtime to use')
@click.option('--port', default="8080", help='Port to use, optional')
@click.option('--params', default=None, help='Params to use, optional')
def run(path :str, source :str = "app.py", type :str = "type", port :str = "8080", params :str = None):
  """
  Run Project

  --path: The path to the project. Required argument.
  --source: The main source file to run. Defaults to 'app.py'.
  --type: The type of content to run. Defaults to 'python'.
  --port: The port to use when content requires one. Defaults to '8080'.
  --params: An optional JSON string with additional parameters.
  """
  api_run(path, source, type, port, params)

@click.command()
@click.argument('path')
@click.option('--target', default="hal9", help='Deployment target')
@click.option('--url', default="https://api.hal9.com", help='Deployment url')
@click.option('--name', default=None, help='Deployment name')
@click.option('--type', '-t', 'typename', default='ability', help='Deployment content')
@click.option('--data', '-d', 'data', default=None, help='Deployment data path')
@click.option('--access', '-a', 'access', default="private", help='Deployment access level')
@click.option('--main', '-m', 'main', default="app.py", help='Deployment main file')
@click.option('--title', '-l', 'title', default=None, help='Deployment title')
@click.option('--description', '-s', 'description', default=None, help='Deployment description')
def deploy(path :str, target :str, url :str, name :str, typename :str, data :str, access :str, main :str, title :str, description :str):
  """
  Deploy Project

  --path: The path to the project. Required argument.
  --url: The server url to deploy to. Defaults to https://api.hal9.com.
  --name: The deployment name.
  --type: The type of content to deploy. Defaults to (chatbot) ability.
  --main: The main file deploy. Defaults to 'app.py'.
  --title: The deployment title.
  --description: deployment The description.
  """

  if (name is None):
    name = f'{os.path.basename(path)}-{int(datetime.datetime.now().timestamp() * 1000)}'

  api_deploy(path, target, url, name, typename, data, access, main, title, description)

@click.command()
@click.option('--runtime', '-r', is_flag=True, help='Describe the runtimes')
@click.option('--content', '-c', is_flag=True, help='Describe the contents')
@click.argument('path', required=False, default=".")
def describe(path: str, runtime :bool, content :bool):
  """
  Describe Command

  --path: The path to describe, defaults to current path.
  --runtime: Describes the available runtimes.
  --content: Describes the content in the path.
  """
  if runtime:
    print(json.dumps(api_run_describe_runtimes()))
  elif content:
    print(json.dumps(api_run_describe_content(path)))

cli.add_command(create)
cli.add_command(run)
cli.add_command(deploy)
cli.add_command(describe)

if __name__ == "__main__":
  cli()