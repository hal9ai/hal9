# Install

```
pip3 install -e ".[dev]" --user
```

# Build

```
python3 setup.py egg_info
python3 setup.py sdist bdist_wheel
pip3 install dist/hal9-0.0.1.tar.gz
```

# Deploy

```
python3 -m twine upload --repository-url https://test.pypi.org/legacy/ dist/*
python3 -m pip install --index-url https://test.pypi.org/simple/ --no-deps hal9
```

# Install

```
pip3 install --upgrade --force-reinstall git+https://github.com/hal9ai/hal9ai.git#subdirectory=python#branch=alpha
```

# Update source code and docs

This source code is generated using the content of `hal9ai/scripts` folder.

Update this package following the steps:

1. Open `hal9ai/python` folder on your IDE of choice.
2. Run `build_components.py`. This will update the `.js` files on `src/hal9/data` (the parsed metadata on hal9 steps) based on `hal9ai/scripts/components.json`.
3. Run `build_init.py`. This will build the py source code for every step adding method such as `filter` or `line_chart`. This also includes the decorated text for the functions.
4. (Requires [sphinx installation](https://www.sphinx-doc.org/en/master/usage/installation.html)) Run `sphinx-build src/hal9` on terminal.



