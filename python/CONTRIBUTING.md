# Install

```
pip3 install -e ".[dev]" --user
```

# Test

```
pytest
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
pip3 install --upgrade --force-reinstall git+https://github.com/hal9ai/hal9ai.git#subdirectory=python
```
