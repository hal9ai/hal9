#' Facets
#'
#' A chart of charts organized in a grid
#'
#' @param h A h9 object created by h9_create.
#' @param x The column in the dataframe that should be along the x-axis in all the subplots.
#' @param y The column in the dataframe that should be along the y-axis in all the subplots.
#' @param facets The columns in the dataframe that should define the marks to facetted subplots in  horizontal and vertical directions of the subplots.
#' @param color The column in the dataframe that will define the color of the marks in each of the subplots.
#' @param chartType The type of chart each of the subplots. Currently supports Scatter, Bar, Line and Cell
#' @param palette Colors to use for the different levels of the y variable. Should be one of the valid d3.js color palettes.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_facets_chart <- function(h, x  = NULL, y  = NULL, facets  = NULL, color  = NULL, chartType  = NULL, palette  = NULL, ...) {
  h9_add_step(
    h,
    "facets",
    matched_call = as.list(match.call())
  )
}

#' Funnel
#'
#' Communicate how data narrows down
#'
#' @param h A h9 object created by h9_create.
#' @param stage The column in the dataframe that contains all the stages of the process
#' @param value The column in the dataframe that contains the values corresponding to each stage of the process
#' @param label The column in the dataframe that should be used to create labels of the stages
#' @param fontSize The font size
#' @param showPercentSelection Boolean on whether to show the percentage in each step
#' @param funnelType The type of the funnel to make. Options are 2d, 3d and flat.
#' @param palette Colors to use for the different levels of the y variable. Should be one of the valid d3.js color palettes.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_funnel_chart <- function(h, stage  = NULL, value  = NULL, label  = NULL, fontSize  = NULL, showPercentSelection  = NULL, funnelType  = NULL, palette  = NULL, ...) {
  h9_add_step(
    h,
    "funnel",
    matched_call = as.list(match.call())
  )
}

#' Map
#'
#' Clearly map out Earthly datasets that have columns for latitude and longitude
#'
#' @param h A h9 object created by h9_create.
#' @param lon The column that contains the values that should be interpreted as the Longitude of vertex
#' @param lat The column that contains the values that should be interpreted as the Longitude of vertex
#' @param size The column propotional to which the points size should be.
#' @param label The column which contains the labels of each of the verticies.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_map_chart <- function(h, lon  = NULL, lat  = NULL, size  = NULL, label  = NULL, ...) {
  h9_add_step(
    h,
    "mapchart",
    matched_call = as.list(match.call())
  )
}

#' Network
#'
#' Dazzle your colleagues with this colorful animated network graph
#'
#' @param h A h9 object created by h9_create.
#' @param from Column containing the origin vertices of all the edges in the graph
#' @param to Column containing the target vertices of all the edges in the graph
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_network_chart <- function(h, from  = NULL, to  = NULL, ...) {
  h9_add_step(
    h,
    "network",
    matched_call = as.list(match.call())
  )
}

#' Plotly
#'
#' Choose from a variety of Plotly visualizations
#'
#' @param h A h9 object created by h9_create.
#' @param x The column that determines the x coordinates in the cartesian plane of the marks
#' @param y The column that determines the y coordinates in the cartesian plane of the marks
#' @param chartType The chart to be constructed. Currently accepts one of lines, scatter, barChart, fillArea, histogram, twoHistogram
#' @param dataSizes The size of the marks
#' @param palette Colors to use for the different levels of the y variable. Should be one of the valid d3.js color palettes.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_plotly_chart <- function(h, x  = NULL, y  = NULL, chartType  = NULL, dataSizes  = NULL, palette  = NULL, ...) {
  h9_add_step(
    h,
    "plotly",
    matched_call = as.list(match.call())
  )
}

#' Radial
#'
#' A circular bar chart
#'
#' @param h A h9 object created by h9_create.
#' @param x The column containing the labels of the charts
#' @param y the column containing the values the areas they occupy in the rectagular area should be propotional to
#' @param wafflesizelabel The size of the large rectangle
#' @param palette the D3 Palette to determine the color scheme to use
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_radial_chart <- function(h, x  = NULL, y  = NULL, wafflesizelabel  = NULL, palette  = NULL, ...) {
  h9_add_step(
    h,
    "radialbars",
    matched_call = as.list(match.call())
  )
}

#' Regression
#'
#' Fit a regression model to a dataset to predict future values
#'
#' @param h A h9 object created by h9_create.
#' @param x Additional step parameter.
#' @param y Additional step parameter.
#' @param type Additional step parameter.
#' @param predictions Additional step parameter.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_regression_chart <- function(h, x  = NULL, y  = NULL, type  = NULL, predictions  = NULL, ...) {
  h9_add_step(
    h,
    "regressionchart",
    matched_call = as.list(match.call())
  )
}

#' Waffle
#'
#' A square pie chart; still not edible
#'
#' @param h A h9 object created by h9_create.
#' @param x Additional step parameter.
#' @param y Additional step parameter.
#' @param wafflesizelabel Additional step parameter.
#' @param palette Additional step parameter.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_waffle_chart <- function(h, x  = NULL, y  = NULL, wafflesizelabel  = NULL, palette  = NULL, ...) {
  h9_add_step(
    h,
    "waffle",
    matched_call = as.list(match.call())
  )
}

#' Waterfall
#'
#' Lay out cascades of data next to a towering waterfall representing the total
#'
#' @param h A h9 object created by h9_create.
#' @param x The column that sets the x coordinates
#' @param y A cumalative sum is calculated on this column and then the difference are visualized
#' @param fontsize The font size
#' @param marginleft The left margin
#' @param marginbottom The bottom margin
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_waterfall_chart <- function(h, x  = NULL, y  = NULL, fontsize  = NULL, marginleft  = NULL, marginbottom  = NULL, ...) {
  h9_add_step(
    h,
    "waterfall",
    matched_call = as.list(match.call())
  )
}

#' Wordcloud
#'
#' Make the most frequent words in a dataset stand out in a trendy way
#'
#' @param h A h9 object created by h9_create.
#' @param label The column containing words to be added to the cloud
#' @param size The column the size of the words should be in propotion to
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_wordcloud_chart <- function(h, label  = NULL, size  = NULL, ...) {
  h9_add_step(
    h,
    "wordcloud",
    matched_call = as.list(match.call())
  )
}

