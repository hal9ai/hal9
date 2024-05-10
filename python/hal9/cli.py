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
def create(path):
    """
    Create Project

    PATH: The path for the new project. Required argument.
    """
    api_create(path, "openai")

@click.command()
@click.argument('path')
def run(path):
    """
    Run Project

    PATH: The path to the project. Required argument.
    """
    api_run(path)

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