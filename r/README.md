
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
devtools::install_github("hal9ai/hal9ai")
```

## Basic Usage

Hal9 is a javascript library that enables anyone to compose
visualizations and predictive models optimized for websites and web
APIs.

You can explore your data interactively using the `hal9` function:

``` r
library(hal9)
## basic example code

h9_create(my_data)
```

You may also build a specific pipeline using our high-level functions:

``` r
# a plot pipeline
mtcars |> 
  h9_create() |> 
  h9_scatter(x = "mpg", y = "wt")
```

<img src="https://raw.githubusercontent.com/hal9ai/hal9ai/main/r/inst/htmlwidgets/scatter_example.png" width="50%" style="display: block; margin: auto;" />

``` r
# a plot pipeline
mtcars |> 
  h9_create() |> 
  h9_scatter(x = "mpg", y = "wt")
```

<img src="inst/htmlwidgets/scatter_example.png" width="50%" style="display: block; margin: auto;" />

## TO DO

-   [ ] Test infrastructure
-   [x] `h9_create()` first draft
-   [x] `h9_add_step()` first draft
-   [ ] Support to all steps

#### Examples

-   [ ] R Markdown use case
-   [ ] Shiny use case
-   [ ] Stats/ML use case
-   [ ] Publishing hal9 vignette (rpubs, shinyapps, stand alone html)
