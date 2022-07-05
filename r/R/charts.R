#' Bar
#'
#' Our first chart type needs no introduction
#'
#' @param h A h9 object created by h9_create.
#' @param x The variable that horizontal axis
#' @param y The variable that should be on the vertical axis.
#' @param type One of 'grouped' or 'stacked'. In grouped mode, bars are placed next to each other, in stacked mode bars are placed above each other.
#' @param orientation
#' @param palette Colors to use for the different levels of the y variable. Should be one of the valid d3.js color palettes.
#' @param fontsize Size of the font to be used in the x and y axes.
#' @param tickrotation The angle at which to place the x-axis labels
#' @param marginleft the left margin
#' @param marginbottom the bottom margin
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_bar_chart <- function(h, x  = NULL, y  = NULL, type  = NULL, orientation  = NULL, palette  = NULL, fontsize  = NULL, tickrotation  = NULL, marginleft  = NULL, marginbottom  = NULL, ...) {

  h9_add_step(
    h,
    "barchart",
    update = list(
      x = x,
      y = y,
      type = type,
      orientation = orientation,
      palette = palette,
      fontsize = fontsize,
      tickrotation = tickrotation,
      marginleft = marginleft,
      marginbottom = marginbottom,
      ...
    )
  )

}

#' Dot Plot
#'
#' Stack data into columns of dots
#'
#' @param h A h9 object created by h9_create.
#' @param x
#' @param color
#' @param palette
#' @param dotsize
#' @param ticks
#' @param fontsize
#' @param marginleft
#' @param marginbottom
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_dot_plot <- function(h, x  = NULL, color  = NULL, palette  = NULL, dotsize  = NULL, ticks  = NULL, fontsize  = NULL, marginleft  = NULL, marginbottom  = NULL, ...) {

  h9_add_step(
    h,
    "dotplotchart",
    update = list(
      x = x,
      color = color,
      palette = palette,
      dotsize = dotsize,
      ticks = ticks,
      fontsize = fontsize,
      marginleft = marginleft,
      marginbottom = marginbottom,
      ...
    )
  )

}

#' Candles
#'
#' Explain financial trends with a candlestick chart
#'
#' @param h A h9 object created by h9_create.
#' @param x
#' @param min
#' @param max
#' @param open
#' @param close
#' @param levels
#' @param fontsize
#' @param marginleft
#' @param marginbottom
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_error_bar <- function(h, x  = NULL, min  = NULL, max  = NULL, open  = NULL, close  = NULL, levels  = NULL, fontsize  = NULL, marginleft  = NULL, marginbottom  = NULL, ...) {

  h9_add_step(
    h,
    "errorbarchart",
    update = list(
      x = x,
      min = min,
      max = max,
      open = open,
      close = close,
      levels = levels,
      fontsize = fontsize,
      marginleft = marginleft,
      marginbottom = marginbottom,
      ...
    )
  )

}

#' Heatmap
#'
#' Draw attention to larger values with more vibrant colors in this 2D map
#'
#' @param h A h9 object created by h9_create.
#' @param x
#' @param y
#' @param value
#' @param palette
#' @param fontsize
#' @param marginleft
#' @param marginbottom
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_heatmap <- function(h, x  = NULL, y  = NULL, value  = NULL, palette  = NULL, fontsize  = NULL, marginleft  = NULL, marginbottom  = NULL, ...) {

  h9_add_step(
    h,
    "heatmapchart",
    update = list(
      x = x,
      y = y,
      value = value,
      palette = palette,
      fontsize = fontsize,
      marginleft = marginleft,
      marginbottom = marginbottom,
      ...
    )
  )

}

#' Histogram
#'
#' Show further granularity within buckets via optional color palettes
#'
#' @param h A h9 object created by h9_create.
#' @param x The name of the column in the input dataframe that who's distribution to be visualized
#' @param histfunc The function used to aggregate the values collected in each bin for summarization.
#' @param histnorm The aggregation method to apply on outputs of the aggregation functions.
#' @param barmode One of stacked or overlaid, which controls the manner in which multiple distributions selected in x are visualized.
#' @param palette The D3 palette used to control the colors of each of the distributions in x.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_histogram <- function(h, x  = NULL, histfunc  = NULL, histnorm  = NULL, barmode  = NULL, palette  = NULL, ...) {

  h9_add_step(
    h,
    "histogramchart",
    update = list(
      x = x,
      histfunc = histfunc,
      histnorm = histnorm,
      barmode = barmode,
      palette = palette,
      ...
    )
  )

}

#' Line
#'
#' For use with sorted X axis values only...unless you like scribbles
#'
#' @param h A h9 object created by h9_create.
#' @param x
#' @param y
#' @param palette
#' @param domainx
#' @param fontsize
#' @param marginleft
#' @param marginbottom
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_line_chart <- function(h, x  = NULL, y  = NULL, palette  = NULL, domainx  = NULL, fontsize  = NULL, marginleft  = NULL, marginbottom  = NULL, ...) {

  h9_add_step(
    h,
    "linechart",
    update = list(
      x = x,
      y = y,
      palette = palette,
      domainx = domainx,
      fontsize = fontsize,
      marginleft = marginleft,
      marginbottom = marginbottom,
      ...
    )
  )

}

#' Sankey
#'
#' Show the flow with Captain Sankey's signature diagram
#'
#' @param h A h9 object created by h9_create.
#' @param source
#' @param target
#' @param value
#' @param palette
#' @param fontsize
#' @param marginleft
#' @param marginbottom
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_sankey <- function(h, source  = NULL, target  = NULL, value  = NULL, palette  = NULL, fontsize  = NULL, marginleft  = NULL, marginbottom  = NULL, ...) {

  h9_add_step(
    h,
    "sankeychart",
    update = list(
      source = source,
      target = target,
      value = value,
      palette = palette,
      fontsize = fontsize,
      marginleft = marginleft,
      marginbottom = marginbottom,
      ...
    )
  )

}

#' Scatter
#'
#' A tried and true classic
#'
#' @param h A h9 object created by h9_create.
#' @param x
#' @param y
#' @param color
#' @param size
#' @param palette
#' @param fontsize
#' @param marginleft
#' @param marginbottom
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_scatter <- function(h, x  = NULL, y  = NULL, color  = NULL, size  = NULL, palette  = NULL, fontsize  = NULL, marginleft  = NULL, marginbottom  = NULL, ...) {

  h9_add_step(
    h,
    "scatterchart",
    update = list(
      x = x,
      y = y,
      color = color,
      size = size,
      palette = palette,
      fontsize = fontsize,
      marginleft = marginleft,
      marginbottom = marginbottom,
      ...
    )
  )

}

#' Treemap
#'
#' Choose a column to map into colored blocks, and another to further subdivide by size
#'
#' @param h A h9 object created by h9_create.
#' @param label
#' @param size
#' @param palette
#' @param fontsize
#' @param marginleft
#' @param marginbottom
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_treemap <- function(h, label  = NULL, size  = NULL, palette  = NULL, fontsize  = NULL, marginleft  = NULL, marginbottom  = NULL, ...) {

  h9_add_step(
    h,
    "treemapchart",
    update = list(
      label = label,
      size = size,
      palette = palette,
      fontsize = fontsize,
      marginleft = marginleft,
      marginbottom = marginbottom,
      ...
    )
  )

}

