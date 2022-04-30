from setuptools import setup, find_packages
from os import path
from io import open

here = path.abspath(path.dirname(__file__))

LONG_DESCRIPTION = (
  "Hal9 enables users to compose and customize data apps "
  "in seconds, not hours. Hal9 makes use of web-technologies "
  "like tensorflow.js, arquero.js, and d3.js to offload compute "
  "to your browser to create data apps impossible to build before."
)

setup(
  name = 'hal9',
  version = '0.0.2',
  description = 'Web-First Composable Data Apps',
  long_description = 'Build ',
  url = 'https://github.com/hal9ai/hal9ai',
  author = 'Hal9 Inc', 
  author_email = 'javier@hal9.com',
  classifiers = [
    'Development Status :: 3 - Alpha',
    'Intended Audience :: Developers',
    'Topic :: Software Development :: Build Tools',
    'License :: OSI Approved :: Apache 2.0',

    'Programming Language :: Python :: 2.7',
    'Programming Language :: Python :: 3',
    'Programming Language :: Python :: 3.5',
    'Programming Language :: Python :: 3.6',
    'Programming Language :: Python :: 3.7',
    'Programming Language :: Python :: 3.8',
  ],

  keywords = 'data management cloud caching',

  package_dir = {'': 'src'},

  packages = find_packages(where='src'),

  python_requires = '>=2.7, !=3.0.*, !=3.1.*, !=3.2.*, !=3.3.*, !=3.4.*, <4',

  install_requires = [
  ],

  extras_require = {
    'dev': [
      'pytest>=2.0.0',
      'twine>=3.1.1'
    ],
    'test': [
      'pytest>=2.0.0'
    ],
  },

  package_data={
    'hal9': [
      'js/hal9.notebook.js'
    ],
  },

  project_urls={
    'Bug Reports': 'https://github.com/hal9ai/hal9ai/issues',
    'Source': 'https://github.com/hal9ai/hal9ai/',
  },
)