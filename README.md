# Hal9: 

[![Hal9 PyPi Downloads](https://img.shields.io/pypi/dm/hal9?label=PyPI)](https://pypi.org/project/hal9/) [![Hal9 NPM Downloads](https://img.shields.io/npm/dm/hal9.svg?label=NPM)](https://www.npmjs.com/package/hal9)

Hal9 is a framework for building *interactive data apps*. It allows you to utilize your DS/ML code with minimal overhead, and frees you from having to worry about frontend web frameworks. Hal9 consists of the following components:

- **LLM**: A text interface to design your app using large language models.
- **Multi-Lingual**: Packages in R, Python (and more on the way!).

## Getting started

The quickest place to test things out is this hosted demo: [hal9.com/new](https://hal9.com). Refer to the Docs at [hal9.com/docs](https://hal9.com/docs/).

### Python

```bash
pip install hal9
```

```python
import hal9 as h9
h9.start("asks for your name and prints hello")
```

### R 

The development version of the package can be installed via

```r
remotes::install_github("hal9ai/hal9", subdir = "r")

library(hal9)
h9_start("asks for your name and prints hello")
```

## Principles

- Easy to get started. You don't need to read a book or build a reactive execution graph in your head
 before you can build a dashboard.
- First-class multi-lingual support. Power your apps with Python, or R, or combine them, *natively*, without having
to use interop tools such as reticulate or rpy2. Rust and TypeScript APIs are being developed next, with many more to come.
- Respect code and reproducibility. While we make it easy to build apps, all artifacts should be in standard formats
so that you can (if you'd like) work with actual web designers on your team to fulfill corporate styling needs.
- Seamless deployment from applications to production.
