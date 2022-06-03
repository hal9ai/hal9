
<!-- README.md is generated from README.Rmd. Please edit that file -->

# hal9

<!-- badges: start -->
<!-- badges: end -->

The goal of hal9 is to provide R users a high-level hal9.js API.

## Installation

You can install the development version of hal9 from
[GitHub](https://github.com/) with:

``` r
# install.packages("devtools")
devtools::install_github("hal9ai/hal9ai")
```

## Basic Usage

Hal9 is a javascript library that enables anyone to compose
visualizations and predictive models optimized for websites and web
APIs.

You may start building your own pipeline interactively using the `hal9`
function:

``` r
library(hal9)
## basic example code

hal9(my_data)
```

You may also build your pipeline using our high-level functions:

``` r
# option 1
hal9_pipeline() |> 
  hal9_add_data(iris) |> 
  hal9_add_filter() |> 
  hal9_show()

#option 2
hal9_filter_data(iris)
```

## Exporting a pipeline

You may export an existing pipeline built using high level function to a
html file using the `hal9_render` function:

``` r
hal9_pipeline() |> 
  hal9_add_data(iris) |> 
  hal9_add_filter() |> 
  hal9_render("pipeline.html")
```

## Publishing a pipeline

You can also publish your work on RPubs to make it easily shareable
through a link:

``` r
hal9_pipeline() |> 
  hal9_add_data(iris) |> 
  hal9_add_filter() |> 
  hal9_publish()
```
