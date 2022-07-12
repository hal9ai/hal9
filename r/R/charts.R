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
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_bar_chart <- function(h, x  = NULL, y  = NULL, type  = NULL, orientation  = NULL, palette  = NULL, fontsize  = NULL, tickrotation  = NULL, marginleft  = NULL, marginbottom  = NULL, ...) {
  h9_add_step(
    h,
    "barchart",
    matched_call = as.list(match.call())
  )
}

#' Dot Plot
#'
#' Stack data into columns of dots
#'
#' @param h A h9 object created by h9_create.
#' @param x The column in the dataframe whose values should determine the position of the dots along the x-axis
#' @param color The column in the dataframe who's values should determine the color of each dot
#' @param palette the D3 Palette to determine the color scheme to use
#' @param dotsize the size of each dot
#' @param ticks The number of ticks on the x-axis
#' @param fontsize the size of the font in pixels
#' @param marginleft the left margin
#' @param marginbottom the bottom margin
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_dot_chart <- function(h, x  = NULL, color  = NULL, palette  = NULL, dotsize  = NULL, ticks  = NULL, fontsize  = NULL, marginleft  = NULL, marginbottom  = NULL, ...) {
  h9_add_step(
    h,
    "dotplotchart",
    matched_call = as.list(match.call())
  )
}

#' Candles
#'
#' Explain financial trends with a candlestick chart
#'
#' @param h A h9 object created by h9_create.
#' @param x the column in the dataframe that is the contains the values for the x coordinates
#' @param min the column in the dataframe that is the contains the values for the minimum at each x coordinate
#' @param max the column in the dataframe that is the contains the values for the maximum at each x coordinate
#' @param open the column in the dataframe the contains the values at opening at each x coordinate
#' @param close the column in the dataframe the contains the values at close m at each x coordinate
#' @param levels 
#' @param fontsize the font size
#' @param marginleft The left margin
#' @param marginbottom the bottom margin
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_error_chart <- function(h, x  = NULL, min  = NULL, max  = NULL, open  = NULL, close  = NULL, levels  = NULL, fontsize  = NULL, marginleft  = NULL, marginbottom  = NULL, ...) {
  h9_add_step(
    h,
    "errorbarchart",
    matched_call = as.list(match.call())
  )
}

#' Heatmap
#'
#' Draw attention to larger values with more vibrant colors in this 2D map
#'
#' @param h A h9 object created by h9_create.
#' @param x The column in the dataframe that defines the x coordinates of the marks
#' @param y The column in the dataframe that defines the y coordinates of the marks
#' @param value The column in the dataframe that defines the intensity of the colors of the marks
#' @param palette 
#' @param fontsize The font size
#' @param marginleft The left margin
#' @param marginbottom The bottom margin
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_heatmap_chart <- function(h, x  = NULL, y  = NULL, value  = NULL, palette  = NULL, fontsize  = NULL, marginleft  = NULL, marginbottom  = NULL, ...) {
  h9_add_step(
    h,
    "heatmapchart",
    matched_call = as.list(match.call())
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
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_histogram_chart <- function(h, x  = NULL, histfunc  = NULL, histnorm  = NULL, barmode  = NULL, palette  = NULL, ...) {
  h9_add_step(
    h,
    "histogramchart",
    matched_call = as.list(match.call())
  )
}

#' Line
#'
#' For use with sorted X axis values only...unless you like scribbles
#'
#' @param h A h9 object created by h9_create.
#' @param x The column in the dataframe which defines the x coordinate of each vertex of the line
#' @param y The column in the dataframe which defines the y coordinate of each vertex of the line
#' @param palette Colors to use for the different levels of the y variable. Should be one of the valid d3.js color palettes.
#' @param domainx 
#' @param fontsize 
#' @param marginleft 
#' @param marginbottom 
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_line_chart <- function(h, x  = NULL, y  = NULL, palette  = NULL, domainx  = NULL, fontsize  = NULL, marginleft  = NULL, marginbottom  = NULL, ...) {
  h9_add_step(
    h,
    "linechart",
    matched_call = as.list(match.call())
  )
}

#' Sankey
#'
#' Show the flow with Captain Sankey's signature diagram
#'
#' @param h A h9 object created by h9_create.
#' @param source The column containing the source nodes
#' @param target The column containing the target nodes
#' @param value The column containing the volume of each arrow
#' @param palette Colors to use for the different levels of the y variable. Should be one of the valid d3.js color palettes.
#' @param fontsize The font size in pixels
#' @param marginleft The margin on the left
#' @param marginbottom The margin on the bottom
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_sankey_chart <- function(h, source  = NULL, target  = NULL, value  = NULL, palette  = NULL, fontsize  = NULL, marginleft  = NULL, marginbottom  = NULL, ...) {
  h9_add_step(
    h,
    "sankeychart",
    matched_call = as.list(match.call())
  )
}

#' Scatter
#'
#' A tried and true classic
#'
#' @param h A h9 object created by h9_create.
#' @param x The column containing the x coordinates of the marks
#' @param y The column containing the y coordinates of the marks
#' @param color The column that should be used to group the marks into different colors
#' @param size The column the marks should be propotional in area to.
#' @param palette Colors to use for the different levels of the y variable. Should be one of the valid d3.js color palettes.
#' @param fontsize The size of the font to be used
#' @param marginleft The left margin
#' @param marginbottom The Bottom margin
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_scatter_chart <- function(h, x  = NULL, y  = NULL, color  = NULL, size  = NULL, palette  = NULL, fontsize  = NULL, marginleft  = NULL, marginbottom  = NULL, ...) {
  h9_add_step(
    h,
    "scatterchart",
    matched_call = as.list(match.call())
  )
}

#' Treemap
#'
#' Choose a column to map into colored blocks, and another to further subdivide by size
#'
#' @param h A h9 object created by h9_create.
#' @param label The column to be used as labels and colorcode the rectangular sectors
#' @param size The column to which the area of the rectangular sections should be in propotion to
#' @param palette the D3 Palette to determine the color scheme to use
#' @param fontsize The size of the font
#' @param marginleft The left margin
#' @param marginbottom The bottom margin
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_treemap_chart <- function(h, label  = NULL, size  = NULL, palette  = NULL, fontsize  = NULL, marginleft  = NULL, marginbottom  = NULL, ...) {
  h9_add_step(
    h,
    "treemapchart",
    matched_call = as.list(match.call())
  )
}

