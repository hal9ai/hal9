
<!-- README.md is generated from README.Rmd. Please edit that file -->

# hal9 <img src="man/figures/logo.png" align="right" width="120" />

<!-- badges: start -->
<!-- badges: end -->

The goal of hal9 is to provide R users a high-level hal9.js API.

## Installation

You can install the development version of hal9 from
[GitHub](https://github.com/) with:

``` r
# install.packages("devtools")
devtools::install_github("hal9ai/hal9ai", subdir = "r")
```

## Basic Usage

Hal9 is a javascript library that enables anyone to compose
visualizations and predictive models optimized for websites and web
APIs.

You can initialize `hal9` with an empty web app as follows:

``` r
library(hal9)

# create app
h9_create()
```

You may also add data using `h9_load()`:

``` r
# load mtcars
h9_create() |>
  h9_load(mtcars)
```

To build a specific pipeline, use our high-level functions:

``` r
# plot mtcars
h9_create() |>
  h9_load(mtcars) |> 
  h9_scatter_chart(x = "mpg", y = "wt")
```
