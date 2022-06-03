#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
hal9 <- function(data, width = NULL, height = NULL, elementId = NULL) {

  # forward options using x
  x = list(
    data = jsonlite::toJSON(data)
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'hal9',
    x,
    width = width,
    height = height,
    package = 'hal9',
    elementId = elementId,
    sizingPolicy = htmlwidgets::sizingPolicy(padding = 0)
  )
}

#' Shiny bindings for hal9
#'
#' Output and render functions for using hal9 within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a hal9
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name hal9-shiny
#'
#' @export
hal9Output <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'hal9', width, height, package = 'hal9')
}

#' @rdname hal9-shiny
#' @export
renderHal9 <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, hal9Output, env, quoted = TRUE)
}

hal9.filter <- function(data, width = NULL, height = NULL, elementId = NULL) {

  # forward options using x
  x = list(
    data = jsonlite::toJSON(data)
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'hal9-filter',
    x,
    width = width,
    height = height,
    package = 'hal9',
    elementId = elementId,
    sizingPolicy = htmlwidgets::sizingPolicy(padding = 0)
  )
}

