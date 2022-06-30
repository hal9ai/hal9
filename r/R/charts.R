#' Bar
#'
#' Our first chart type needs no introduction
#'
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
h9_bar_chart <- function(h, x, y, type, orientation, palette, fontsize, tickrotation, marginleft, marginbottom, ...) {

  h9_add_step(
    h,
    "barchart",
    list(
      ...
    )
  )

}

#' Dot Plot
#'
#' Stack data into columns of dots
#'
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
h9_dot_plot <- function(h, x, color, palette, dotsize, ticks, fontsize, marginleft, marginbottom, ...) {

  h9_add_step(
    h,
    "dotplotchart",
    list(
      ...
    )
  )

}

#' Candles
#'
#' Explain financial trends with a candlestick chart
#'
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
h9_error_bar <- function(h, x, min, max, open, close, levels, fontsize, marginleft, marginbottom, ...) {

  h9_add_step(
    h,
    "errorbarchart",
    list(
      ...
    )
  )

}

#' Heatmap
#'
#' Draw attention to larger values with more vibrant colors in this 2D map
#'
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
h9_heatmap <- function(h, x, y, value, palette, fontsize, marginleft, marginbottom, ...) {

  h9_add_step(
    h,
    "heatmapchart",
    list(
      ...
    )
  )

}

#' Histogram
#'
#' Show further granularity within buckets via optional color palettes
#'
#' @param x The name of the column in the input dataframe that who's distribution to be visualized
#' @param histfunc The function used to aggregate the values collected in each bin for summarization.
#' @param histnorm The aggregation method to apply on outputs of the aggregation functions.
#' @param barmode One of stacked or overlaid, which controls the manner in which multiple distributions selected in x are visualized.
#' @param palette The D3 palette used to control the colors of each of the distributions in x.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_histogram <- function(h, x, histfunc, histnorm, barmode, palette, ...) {

  h9_add_step(
    h,
    "histogramchart",
    list(
      ...
    )
  )

}

#' Line
#'
#' For use with sorted X axis values only...unless you like scribbles
#'
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
h9_line_chart <- function(h, x, y, palette, domainx, fontsize, marginleft, marginbottom, ...) {

  h9_add_step(
    h,
    "linechart",
    list(
      ...
    )
  )

}

#' Sankey
#'
#' Show the flow with Captain Sankey's signature diagram
#'
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
h9_sankey <- function(h, source, target, value, palette, fontsize, marginleft, marginbottom, ...) {

  h9_add_step(
    h,
    "sankeychart",
    list(
      ...
    )
  )

}

#' Scatter
#'
#' A tried and true classic
#'
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
h9_scatter <- function(h, x, y, color, size, palette, fontsize, marginleft, marginbottom, ...) {

  h9_add_step(
    h,
    "scatterchart",
    list(
      ...
    )
  )

}

#' Treemap
#'
#' Choose a column to map into colored blocks, and another to further subdivide by size
#'
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
h9_treemap <- function(h, label, size, palette, fontsize, marginleft, marginbottom, ...) {

  h9_add_step(
    h,
    "treemapchart",
    list(
      ...
    )
  )

}

