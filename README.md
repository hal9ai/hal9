# Hal9: Interactive data apps --- design visually, power with code

Hal9 is a framework for building interactive data apps for data scientists and engineers. It allows you to utilize your DS/ML code with minimal overhead, and frees you from having to worry about frontend web frameworks. Hal9 consists of the following components:

- **Designer**: A browser WYSIWYG interface to design your app via drag-and-drop
- **Server**: A web service that serves the Designer and manages the compute Runtimes
- **Runtime API**: Packages in R, Python (and more on the way!) for controlling the behavior of elements in your app

## Getting started

Quickest place to test things out is this hosted demo: (TODO)

### MacOS/Linux

Currently, to install the package you need a working Rust toolchain, we recommend grabbing one using [rustup.rs](https://rustup.rs) if you don't have one yet.

Then, you can run

```r
remotes::install_github("hal9ai/hal9", subdir = "r")

library(hal9)
h9_new("my_app")
h9_start("my_app", port = 42069)
```

and this should give you a demo app to get started.

Alternatively, if you prefer working from the terminal, you can clone this repo and run

```
cargo install --path server

hal9 new my_app
hal9 start my_app
```

### Windows / other languages

We're working on streamlining the installation process for these... if you'd like to help, give us a shout ;)

## Philosophy

- Easy to get started. You don't need to read a book or build a reactive execution graph in your head
 before you can build a dashboard.
- First-class multi-lingual support. Power your apps with Python, or R, or combine them, *natively*, without having
to use interop tools such as reticulate or rpy2. Rust and TypeScript APIs are being developed next, with many more to come.
- Respect code and reproducibility. While we make it easy to build apps, all artifacts should be in standard formats
so that you can (if you'd like) work with actual web designers on your team to fulfill corporate styling needs.

