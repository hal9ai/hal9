#' Title
#'
#' @param data
#' @param width
#' @param height
#' @param elementId
#'
#' @export
#'
h9_create <- function(data, width = "100%", height = "100%", elementId = NULL) {

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
    data = jsonlite::toJSON(data, na = "string"),
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

h9_filter <- function(h, ...) {
  h9_add_step(h, "filter")
}

h9_slider <- function(h, ...) {
  h9_add_step(h, "slider")
}

h9_sample <- function(h, ...) {
  h9_add_step(h, "sample")
}

h9_add_step <- function(h, step, update = NULL) {

  novo_id <- lapply(h$x$pipeline$steps, function(x) x$id) |>
    as.numeric() |>
    max()

  novo_id <- novo_id + 1

  comp <- components[[which(lapply(components, function(x) x$name) == step)]]

  h$x$pipeline$steps <- c(
    h$x$pipeline$steps,
    list(
      list(
        name = comp$name,
        label = comp$label,
        language = comp$language,
        description = comp$description,
        icon = comp$icon,
        id = novo_id,
        params = NULL
      )
    )
  )

  l_params <- list(
    ph = build_param_list(comp$params)
  )
  names(l_params) <- novo_id

  if(!is.null(update)){

    inputed <- names(update)

    for(ii in seq_along(update)){
      if(l_params[[1]][[ii]]$name == inputed[ii]){
        l_params[[1]][[ii]]$value <- list(build_value_list(update[ii])[[1]])
      }
    }

  }

  h$x$pipeline$params <- c(
    h$x$pipeline$params,
    l_params
  )

  h$x$pipeline_json <- jsonlite::toJSON(
    h$x$pipeline,
    null = "list",
    auto_unbox = TRUE
  )

  h

}

