
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

hal9(my_data)
```

You may also build a specific pipeline using our high-level functions:

``` r
mtcars |> 
  hal9() |> 
  hal9_add_filter()

#option 2

# pre-built common pipelines
hal9_filter(mtcars)
```

## Exporting a pipeline

You may export an existing pipeline built using high level functions to
a html file using the `hal9_render` function:

``` r
mtcars |> 
  hal9() |> 
  hal9_to_html(file = "myHal9.html")
```

## Publishing a pipeline

You can also publish your work on RPubs and make it easily shareable
through a link:

``` r
mtcars |> 
  hal9() |> 
  hal9_publish(file = "myHal9.html")
```

## TO DO

-   [ ] Test infrastructure
-   [x] `hal9_render()` first draft
-   [ ] `hal9_render()` tests
-   [x] `hal9_publish()` first draft

#### Maybe

-   [ ] Shiny use case
-   [ ] Stats/ML use case
-   [ ] Publishing hal9 vignette (rpubs, shinyapps, stand alone html)
