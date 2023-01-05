FROM hal9ai/hal9-docker:0.0.6 as base

COPY ./ /hal9

RUN apt install -y libssl-doc
RUN apt install python-is-python3

WORKDIR "/hal9"
RUN cargo build --manifest-path=server/Cargo.toml
RUN R CMD INSTALL r

WORKDIR "/hal9/server"
RUN cargo build

WORKDIR "/hal9/python"
RUN maturin build -m Cargo.toml -F pyo3 -b pyo3
RUN python3 -m pip install --upgrade pip
RUN python3 -m pip install -f target/wheels/* --force-reinstall

WORKDIR "/hal9"
RUN python3 -c "import hal9"

WORKDIR "/hal9/worker"
RUN yarn
RUN yarn build

RUN ln -sf ../server/target/debug/hal9 hal9

CMD [ "yarn", "start" ]
