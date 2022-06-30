#' Bubbles
#'
#' Bigger values -> bigger bubbles
#'
#' @param label 
#' @param size 
#' @param palette 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_bubble_chart <- function(h, label, size, palette, ...) {

  h9_add_step(
    h,
    "bubblechart",
    list(
      ...
    )
  )

}

#' Facets
#'
#' A chart of charts organized in a grid
#'
#' @param x 
#' @param y 
#' @param facets 
#' @param color 
#' @param chartType 
#' @param palette 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_facets <- function(h, x, y, facets, color, chartType, palette, ...) {

  h9_add_step(
    h,
    "facets",
    list(
      ...
    )
  )

}

#' Funnel
#'
#' Communicate how data narrows down
#'
#' @param stage 
#' @param value 
#' @param label 
#' @param fontSize 
#' @param showPercentSelection 
#' @param funnelType 
#' @param palette 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_funnel <- function(h, stage, value, label, fontSize, showPercentSelection, funnelType, palette, ...) {

  h9_add_step(
    h,
    "funnel",
    list(
      ...
    )
  )

}

#' Map
#'
#' Clearly map out Earthly datasets that have columns for latitude and longitude
#'
#' @param lon 
#' @param lat 
#' @param size 
#' @param label 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_map <- function(h, lon, lat, size, label, ...) {

  h9_add_step(
    h,
    "map",
    list(
      ...
    )
  )

}

#' Network
#'
#' Dazzle your colleagues with this colorful animated network graph
#'
#' @param from 
#' @param to 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_network <- function(h, from, to, ...) {

  h9_add_step(
    h,
    "network",
    list(
      ...
    )
  )

}

#' Plotly
#'
#' Choose from a variety of Plotly visualizations
#'
#' @param x 
#' @param y 
#' @param chartType 
#' @param dataSizes 
#' @param palette 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_plotly <- function(h, x, y, chartType, dataSizes, palette, ...) {

  h9_add_step(
    h,
    "plotly",
    list(
      ...
    )
  )

}

#' Radial
#'
#' A circular bar chart
#'
#' @param x 
#' @param y 
#' @param palette 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_radial_bars <- function(h, x, y, palette, ...) {

  h9_add_step(
    h,
    "radialbars",
    list(
      ...
    )
  )

}

#' Waffle
#'
#' A square pie chart; still not edible
#'
#' @param x 
#' @param y 
#' @param wafflesizelabel 
#' @param palette 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_waffle <- function(h, x, y, wafflesizelabel, palette, ...) {

  h9_add_step(
    h,
    "waffle",
    list(
      ...
    )
  )

}

#' Waterfall
#'
#' Lay out cascades of data next to a towering waterfall representing the total
#'
#' @param x 
#' @param y 
#' @param fontsize 
#' @param marginleft 
#' @param marginbottom 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_waterfall <- function(h, x, y, fontsize, marginleft, marginbottom, ...) {

  h9_add_step(
    h,
    "waterfall",
    list(
      ...
    )
  )

}

#' Wordcloud
#'
#' Make the most frequent words in a dataset stand out in a trendy way
#'
#' @param label 
#' @param size 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_wordcloud <- function(h, label, size, ...) {

  h9_add_step(
    h,
    "wordcloud",
    list(
      ...
    )
  )

}

