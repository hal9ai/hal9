# read version from installed package
from importlib.metadata import version
__version__ = version("hal9")
from hal9.core import *
