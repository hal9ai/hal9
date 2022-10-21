This folder contains the worker components like docker, the node server and deployment scripts that trigger from GitHub. This project is used by the server to run user code in our backend.

## Building

```bash
# worker dependencies
yarn clean
yarn install
```

```bash
# build and launch worker
yarn build
yarn start
```

## Docker

To start a Hal9 Docker worker, run:

```
docker pull hal9ai/hal9-worker:0.2.0
docker run hal9ai/hal9-worker:0.2.0 
```

## Backend

To run the worker locally with runtimes support:
- Build R package with `R CMD .` under `/r` folder.
- Build Python package under `/python` folder.
- Build the server with `cargo build .` under `/server` folder.

Then create a symlink from `hal9` to `server/target/debug/hal9`, or add `hal9` to the path, for example:

```
ln -sf ../server/target/debug/hal9 hal9
```
