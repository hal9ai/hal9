#' Facets
#'
#' A chart of charts organized in a grid
#'
#' @param h A h9 object created by h9_create.
#' @param x 
#' @param y 
#' @param facets 
#' @param color 
#' @param chartType 
#' @param palette 
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_facets <- function(h, x  = NULL, y  = NULL, facets  = NULL, color  = NULL, chartType  = NULL, palette  = NULL, ...) {

  h9_add_step(
    h,
    "facets",
    update = list(
      x = x,
      y = y,
      facets = facets,
      color = color,
      chartType = chartType,
      palette = palette,
      ...
    )
  )

}

#' Funnel
#'
#' Communicate how data narrows down
#'
#' @param h A h9 object created by h9_create.
#' @param stage 
#' @param value 
#' @param label 
#' @param fontSize 
#' @param showPercentSelection 
#' @param funnelType 
#' @param palette 
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_funnel <- function(h, stage  = NULL, value  = NULL, label  = NULL, fontSize  = NULL, showPercentSelection  = NULL, funnelType  = NULL, palette  = NULL, ...) {

  h9_add_step(
    h,
    "funnel",
    update = list(
      stage = stage,
      value = value,
      label = label,
      fontSize = fontSize,
      showPercentSelection = showPercentSelection,
      funnelType = funnelType,
      palette = palette,
      ...
    )
  )

}

#' Map
#'
#' Clearly map out Earthly datasets that have columns for latitude and longitude
#'
#' @param h A h9 object created by h9_create.
#' @param lon 
#' @param lat 
#' @param size 
#' @param label 
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_map <- function(h, lon  = NULL, lat  = NULL, size  = NULL, label  = NULL, ...) {

  h9_add_step(
    h,
    "map",
    update = list(
      lon = lon,
      lat = lat,
      size = size,
      label = label,
      ...
    )
  )

}

#' Network
#'
#' Dazzle your colleagues with this colorful animated network graph
#'
#' @param h A h9 object created by h9_create.
#' @param from 
#' @param to 
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_network <- function(h, from  = NULL, to  = NULL, ...) {

  h9_add_step(
    h,
    "network",
    update = list(
      from = from,
      to = to,
      ...
    )
  )

}

#' Plotly
#'
#' Choose from a variety of Plotly visualizations
#'
#' @param h A h9 object created by h9_create.
#' @param x 
#' @param y 
#' @param chartType 
#' @param dataSizes 
#' @param palette 
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_plotly <- function(h, x  = NULL, y  = NULL, chartType  = NULL, dataSizes  = NULL, palette  = NULL, ...) {

  h9_add_step(
    h,
    "plotly",
    update = list(
      x = x,
      y = y,
      chartType = chartType,
      dataSizes = dataSizes,
      palette = palette,
      ...
    )
  )

}

#' Radial
#'
#' A circular bar chart
#'
#' @param h A h9 object created by h9_create.
#' @param x 
#' @param y 
#' @param palette 
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_radial_bars <- function(h, x  = NULL, y  = NULL, palette  = NULL, ...) {

  h9_add_step(
    h,
    "radialbars",
    update = list(
      x = x,
      y = y,
      palette = palette,
      ...
    )
  )

}

#' Waffle
#'
#' A square pie chart; still not edible
#'
#' @param h A h9 object created by h9_create.
#' @param x 
#' @param y 
#' @param wafflesizelabel 
#' @param palette 
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_waffle <- function(h, x  = NULL, y  = NULL, wafflesizelabel  = NULL, palette  = NULL, ...) {

  h9_add_step(
    h,
    "waffle",
    update = list(
      x = x,
      y = y,
      wafflesizelabel = wafflesizelabel,
      palette = palette,
      ...
    )
  )

}

#' Waterfall
#'
#' Lay out cascades of data next to a towering waterfall representing the total
#'
#' @param h A h9 object created by h9_create.
#' @param x 
#' @param y 
#' @param fontsize 
#' @param marginleft 
#' @param marginbottom 
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_waterfall <- function(h, x  = NULL, y  = NULL, fontsize  = NULL, marginleft  = NULL, marginbottom  = NULL, ...) {

  h9_add_step(
    h,
    "waterfall",
    update = list(
      x = x,
      y = y,
      fontsize = fontsize,
      marginleft = marginleft,
      marginbottom = marginbottom,
      ...
    )
  )

}

#' Wordcloud
#'
#' Make the most frequent words in a dataset stand out in a trendy way
#'
#' @param h A h9 object created by h9_create.
#' @param label 
#' @param size 
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_wordcloud <- function(h, label  = NULL, size  = NULL, ...) {

  h9_add_step(
    h,
    "wordcloud",
    update = list(
      label = label,
      size = size,
      ...
    )
  )

}

