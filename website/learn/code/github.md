---
sidebar_position: 80
---

# Deploying from GitHub

Cloudish builds containers from a `Dockerfile` or source folder server-side, so you can deploy straight from a GitHub repository. The easiest path is to ask your AI coding agent to set it up:

> Add a GitHub Actions workflow that deploys this repository to cloudish.ai whenever `main` changes. Read the current deployment API at https://cloudish.ai/skill.md, store the Cloudish API key in a repository secret named `CLOUDISH_API_KEY`, and fail the workflow if the build fails.

If you prefer to write the workflow yourself, the steps are the same as a manual deployment: create a build context, upload it to Cloudish, and poll the build until it succeeds.

## Prepare your repository

First, create a GitHub repository and copy your project files into it. The repository needs a `Dockerfile` at its root that installs your dependencies and listens on `0.0.0.0`.

You also need a Cloudish API key. Ask your agent to create one, or call the API once:

```bash
curl -sS -X POST https://cloudish.ai/api/v1/keys \
  -H "content-type: application/json" \
  -d '{"alias": "my-github-app", "agent": "github-actions"}'
```

Store the returned `key` as a repository secret:

- Go to your GitHub repository, then **Settings**, **Secrets and variables**, **Actions**.
- Click **New repository secret**.
- Name it `CLOUDISH_API_KEY` and paste the key.

Never commit the key to the repository.

## Deployment workflow

Create `.github/workflows/cloudish.yaml`:

```yaml
name: Deploy to Cloudish

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build context and deploy
        env:
          CLOUDISH_API_KEY: ${{ secrets.CLOUDISH_API_KEY }}
        run: |
          tar --exclude='.env*' --exclude='.git' --exclude='.storage' -czf context.tar.gz .

          response=$(curl -sS -X POST https://cloudish.ai/api/v1/projects \
            -H "Authorization: Bearer ${CLOUDISH_API_KEY}" \
            -F "name=my-app" -F "port=8080" -F "context=@context.tar.gz")

          echo "${response}"
          build_id=$(echo "${response}" | jq -r '.build.id')

          if [ "${build_id}" = "null" ]; then
            echo "Deployment request did not return a build id"
            exit 1
          fi

          while true; do
            result=$(curl -sS "https://cloudish.ai/api/v1/images/builds/${build_id}" \
              -H "Authorization: Bearer ${CLOUDISH_API_KEY}")
            status=$(echo "${result}" | jq -r '.build.status')
            echo "Build ${build_id}: ${status}"

            if [ "${status}" = "null" ]; then
              echo "${result}"
              exit 1
            fi

            case "${status}" in
              succeeded)
                echo "${result}"
                break
                ;;
              failed)
                echo "${result}" | jq -r '.build.error'
                echo "${result}" | jq -r '.build.logs' | tail -50
                exit 1
                ;;
              *)
                sleep 10
                ;;
            esac
          done
```

The build context excludes `.env*`, `.git`, and `.storage` so credentials and local data are not uploaded. Provide real credentials as Cloudish secrets instead; see [Deployment](deployment.md).

:::note
Older workflows used `HAL9_TOKEN` and `hal9 deploy` to publish to Hal9 Platform. That platform is read-only while it transitions to Cloudish and no longer accepts deployments; migrate those workflows to Cloudish.
:::
