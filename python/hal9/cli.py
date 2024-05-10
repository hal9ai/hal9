import click
from collections import OrderedDict
from hal9.api import *

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
def create(path):
    """
    Create Project

    PATH: The path for the new project. Required argument.
    """
    print(f'Creating: {path}')

@click.command()
@click.argument('path')
def run(path):
    """
    Run Project

    PATH: The path to the project. Required argument.
    """
    print(f'Running {path}')

@click.command()
@click.argument('path')
def deploy(path):
    """
    Deploy Project

    PATH: The path to the project. Required argument.
    """
    print(f'Deploying {path}')

cli.add_command(create)
cli.add_command(run)
cli.add_command(deploy)

if __name__ == "__main__":
    cli()