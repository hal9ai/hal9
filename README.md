# Hal9: ML Apps &mdash; Design visually, power with code
[![Hal9 PyPi Downloads](https://img.shields.io/pypi/dm/hal9?label=PyPI)](https://pypi.org/project/hal9/) [![Hal9 NPM Downloads](https://img.shields.io/npm/dm/hal9.svg?label=NPM)](https://www.npmjs.com/package/hal9)

Hal9 is a framework for building *ML Apps* for scientists and engineers. It allows you to utilize your DS/ML code with minimal overhead, and frees you from having to worry about frontend web frameworks. Hal9 consists of the following components:

- **Visual Designer**: A browser WYSIWYG interface to design your app via drag-and-drop, yet fuly customizable with HTML.
- **Multi-Lingual Server**: Packages in R, Python, HTML, JavaScript (and more on the way!) for controlling the behavior of elements in your app.

## Getting started

The quickest place to test things out is this hosted demo: [hal9.com/new](https://hal9.com/new). Refer to the Docs at [hal9.com/docs](https://hal9.com/docs/).

### Python

```bash
pip install hal9
```

```python
import hal9 as h9
h9.new("my_app")
h9.start("my_app")
```

### R 

The development version of the package can be installed via

```r
remotes::install_github("hal9ai/hal9", subdir = "r")

library(hal9)
h9_new("my_app")
h9_start("my_app")
```

This requires Rust toolchain, e.g., [rustup.rs](https://rustup.rs).

### CLI

Alternatively, if you prefer working from the terminal, you can clone this repo and run

```
cargo install --path server

hal9 new my_app
hal9 start my_app
```

This requires Rust toolchain, e.g., [rustup.rs](https://rustup.rs).

## Principles

- Easy to get started. You don't need to read a book or build a reactive execution graph in your head
 before you can build a dashboard.
- First-class multi-lingual support. Power your apps with Python, or R, or combine them, *natively*, without having
to use interop tools such as reticulate or rpy2. Rust and TypeScript APIs are being developed next, with many more to come.
- Respect code and reproducibility. While we make it easy to build apps, all artifacts should be in standard formats
so that you can (if you'd like) work with actual web designers on your team to fulfill corporate styling needs.
- Seamless deployment from applications to production.
