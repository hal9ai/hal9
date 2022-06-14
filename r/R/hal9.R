#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
hal9 <- function(data, width = NULL, height = NULL, elementId = NULL) {

  pipeline <- list(
    steps = list(
      list(
        name = "javascript",
        label = "Source",
        language = "javascript",
        id = 1,
        params = NULL
      )
    ),
    params = list(
      "1" = NULL
    ),
    outputs = NULL,
    scripts = list(
      "1" = "data = window.hal9.data"
    ),
    version = "0.0.1"
  )

  # forward options using x
  x = list(
    data = jsonlite::toJSON(data),
    pipeline = pipeline,
    pipeline_json = jsonlite::toJSON(pipeline, null = "list", auto_unbox = TRUE)
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

hal9_filter <- function(data, width = NULL, height = NULL, elementId = NULL) {
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

hal9_add_filter <- function(h) {

  novo_id <- lapply(h$x$pipeline$steps, function(x) x$id) |>
    as.numeric() |>
    max()

  novo_id <- novo_id + 1

  h$x$pipeline$steps <- c(
    h$x$pipeline$steps,
    list(
      list(
        name = "filter",
        label = "Filter",
        language = "javascript",
        description = "Keep only the rows that satisfy a given expression for a specific column",
        icon = "fa-light fa-filter",
        id = novo_id,
        params = NULL
      )
    )
  )

  l_params <- list(
    a = list(
      field = list(
        id = 0,
        static = FALSE,
        value = list(
          list(
            id = 0,
            name = "",
            label = ""
          )
        ),
        name = "field",
        label = "Field",
        single = TRUE
      ),
      expression = list(
        id = 1,
        static = TRUE,
        value = list(
          list(
            id = 1,
            control = "textbox",
            value = "field != null"
          )
        ),
        name = "expression",
        label = "Expression"
      )
    )
  )
  names(l_params) <- novo_id

  h$x$pipeline$params <- c(
    h$x$pipeline$params,
    l_params
  )

  script <- system.file("scripts/filter.txt.js", package = "hal9") |>
    readLines() |>
    paste(collapse = "\n")

  l_script <- list(
    a = script
  )

  names(l_script) <- novo_id

  h$x$pipeline$script <- c(
    h$x$pipeline$script,
    l_script
  )

  h$x$pipeline_json <- jsonlite::toJSON(
    h$x$pipeline,
    null = "list",
    auto_unbox = TRUE
  )

  h

}

