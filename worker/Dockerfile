FROM hal9ai/hal9-docker:0.0.3 as base

RUN apt install -y libssl-doc
RUN git clone https://github.com/hal9ai/hal9 h9backend
RUN cd h9backend && git reset --hard c090d2b && cd ..
RUN cargo build --manifest-path=h9backend/server/Cargo.toml
RUN R CMD INSTALL h9backend/r
WORKDIR "/h9backend/server"
RUN cargo build
WORKDIR "/h9backend/python"
RUN maturin build -m Cargo.toml -F pyo3 -b pyo3
RUN python3 -m pip install --upgrade pip
RUN python3 -m pip install -v target/wheels/hal9-0.1.0-cp38-abi3-manylinux_2_31_x86_64.whl --force-reinstall
WORKDIR "/h9backend/"
RUN python3 -c "import hal9"
