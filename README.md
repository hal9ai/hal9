# Hal9: Interactive data apps &mdash; design visually, power with code

Hal9 is a framework for building *interactive data apps* for data scientists and engineers. It allows you to utilize your DS/ML code with minimal overhead, and frees you from having to worry about frontend web frameworks. Hal9 consists of the following components:

- **Visual Designer**: A browser WYSIWYG interface to design your app via drag-and-drop, yet fuly customizable with HTML.
- **Multi-Lingual Server**: Packages in R, Python, JavaScript (and more on the way!) for controlling the behavior of elements in your app.

## Getting started

The quickest place to test things out is this hosted demo: [hal9.com/new](https://hal9.com/new).

Refer to the Docs at [hal9.com/docs](https://hal9.com/docs/).

Even more concise quickstart to get up and running locally (requires Rust toolchain, e.g., [rustup.rs](https://rustup.rs)):

### R 

The development version of the package can be installed via

```r
remotes::install_github("hal9ai/hal9", subdir = "r")

library(hal9)
h9_new("my_app")
h9_start("my_app")
```

which should give you a demo app to get started.

Alternatively, if you prefer working from the terminal, you can clone this repo and run

```
cargo install --path server

hal9 new my_app
hal9 start my_app
```

### Python

We're working on streamlining the installation process, but if you're feeling adventurous and want to try
building from source, check out the [developer docs](https://hal9.com/docs/building.html).

## Principles

- Easy to get started. You don't need to read a book or build a reactive execution graph in your head
 before you can build a dashboard.
- First-class multi-lingual support. Power your apps with Python, or R, or combine them, *natively*, without having
to use interop tools such as reticulate or rpy2. Rust and TypeScript APIs are being developed next, with many more to come.
- Respect code and reproducibility. While we make it easy to build apps, all artifacts should be in standard formats
so that you can (if you'd like) work with actual web designers on your team to fulfill corporate styling needs.
- Seamless deployment from applications to production.
