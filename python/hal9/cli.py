import click
from collections import OrderedDict
from hal9.create import create as api_create
from hal9.run import run as api_run
from hal9.deploy import deploy as api_deploy

@click.group()
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

    PATH: The path for the new project. Required argument.
    """
    api_create(path, "openai")

@click.command()
@click.argument('path')
def run(path :str):
    """
    Run Project

    PATH: The path to the project. Required argument.
    """
    api_run(path)

@click.command()
@click.argument('path')
@click.option('--target', default="hal9", help='Deployment target')
@click.option('--url', default="https://api.hal9.com", help='Deployment url')
def deploy(path :str, target :str, url :str):
    """
    Deploy Project

    PATH: The path to the project. Required argument.
    """
    api_deploy(path, target, url)

cli.add_command(create)
cli.add_command(run)
cli.add_command(deploy)

if __name__ == "__main__":
    cli()