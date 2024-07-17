import click
from collections import OrderedDict
from hal9.create import create as api_create
from hal9.run import run as api_run
from hal9.deploy import deploy as api_deploy
import datetime
import os
import pkg_resources

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
def create(path :str):
  """
  Create Project

  --path: The path for the new project. Required argument.
  """
  api_create(path, "openai")

@click.command()
@click.argument('path')
def run(path :str):
  """
  Run Project

  --path: The path to the project. Required argument.
  """
  api_run(path)

@click.command()
@click.argument('path')
@click.option('--target', default="hal9", help='Deployment target')
@click.option('--url', default="https://api.hal9.com", help='Deployment url')
@click.option('--name', default=None, help='Deployment name')
@click.option('--type', '-f', 'typename', default='ability', help='Deployment content')
@click.option('--data', '-d', 'data', default=None, help='Deployment data path')
def deploy(path :str, target :str, url :str, name :str, typename :str, data :str):
  """
  Deploy Project

  --path: The path to the project. Required argument.
  --url: The server url to deploy to. Defaults to https://api.hal9.com.
  --name: The server url to deploy to. Defaults to https://api.hal9.com.
  --type: The type of content to deploy. Defaults to (chatbot) ability.
  """

  if (name is None):
    name = f'{os.path.basename(path)}-{int(datetime.datetime.now().timestamp() * 1000)}'

  api_deploy(path, target, url, name, typename, data)

cli.add_command(create)
cli.add_command(run)
cli.add_command(deploy)

if __name__ == "__main__":
  cli()