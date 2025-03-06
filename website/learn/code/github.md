---
sidebar_position: 80
---

# Deploying GitHub

You can deploy from GitHub to Hal9 using GitHub Actions as follows.

## Prepare your Repo

First create a GitHub and copy all the files into GitHub.

## Retrieve Hal9 Token

- Go to https://hal9.com/devs and retrieve your token
- Go to your GitHub repo page and click "Settings", then "Secrets and Vartiables", "Actions" and click "New repository secret"
- Name the secret "HAL9_TOKEN" and asssign the token generated in https://hal9.com/devs, save the secret.

## Deployment File

Create a file similar to the one bellow and save it inside your repo under `.github/workflows/hal9.yaml`. Make sure to customize the `hal9 deploy` command in the file correctly, see [Deploying Assets](deployment.md) section.

```yaml
name: Hal9

on:
  push:
    branches:
      - main

jobs:
  devel:
    runs-on: ubuntu-latest
    steps:
    - name: Set up Python 3.10
      uses: actions/setup-python@v1
      with:
        python-version: '3.10'
    - name: Install Hal9
      run: pip install hal9
    - uses: actions/checkout@v1
    - name: Deploy changed apps
      env:
        HAL9_TOKEN: ${{ secrets.HAL9_TOKEN }}
      run: |
        hal9 deploy . --name mygithub --access unlisted --title MyGithub --description "MyGithub Content";
```
