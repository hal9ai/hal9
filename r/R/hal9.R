#' Hal9 Create
#'
#' Create a h9 object.
#'
#' @param width Width of the widget container.
#' @param height Height of the widget container.
#' @param environment The environment to use, production by default. Use 'devel' for
#'   development and 'local' for local developer environment.
#' @param iframe Should the application run inside an iframe to protect styles and
#'   resources from the parent? Defaults to 'TRUE'.
#' @param version The version of the runtime to use.
#' @param mode Should the application be run or designed? Valid values "run" or
#'   "design", defaults to "run" unless the application is empty.
#' @param ... Additional parameters
#'
#' @export
#'
h9_create <- function(
  width = NULL,
  height = NULL,
  environment = 'devel',
  iframe = TRUE,
  version = "0.3.0",
  mode = c("run", "design"),
  ...) {
  elementId <- list(...)$elementId

  library <- list(
    prod = paste0("https://cdn.jsdelivr.net/npm/hal9@", version, "/dist/hal9.min.js"),
    devel = paste0("https://cdn.jsdelivr.net/npm/hal9@", version, "/dist/hal9.dev.js"),
    local = "http://localhost:8000/dist/hal9.js"
  )

  pipeline <- list(
    steps = list(
    ),
    params = list(
    ),
    outputs = NULL,
    scripts = list(
    ),
    version = "0.0.1"
  )

  # forward options using x
  x = list(
    pipeline = pipeline,
    pipeline_json = jsonlite::toJSON(pipeline, null = "list", auto_unbox = TRUE),
    library = library[[environment]],
    environment = environment,
    iframe = iframe,
    mode = ifelse(identical(mode, c("run", "design")), "default", mode)
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

h9_add_step <- function(h, step, rebind = NULL, matched_call = NULL) {
  novo_id <- lapply(h$x$pipeline$steps, function(x) x$id) |>
    as.numeric() |>
    max(0)

  novo_id <- novo_id + 1

  comp <- components[[which(lapply(components, function(x) x$name) == step)]]

  new_step <- list(
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

  if (!identical(rebind, NULL)) {
    # TODO: Add support for inputs and ouputs
    new_step[[1]]$options <- list(
      rebinds = list(
        params = rebind
      )
    )
  }

  h$x$pipeline$steps <- c(
    h$x$pipeline$steps,
    new_step
  )

  l_params <- list(
    ph = build_param_list(comp$params)
  )
  names(l_params) <- novo_id

  update <- names(matched_call)[-c(1, 2)]

  if(length(update) > 0) {

    for(i in seq_along(update)) {
      val <- l_params[[1]][[update[i]]]$value
      arg_value <- matched_call[[update[i]]]

      if(is.null(l_params[[1]][[update[[i]]]]$static)){
        l_params[[1]][[update[[i]]]]$static <- TRUE
      }

      if (is.list(val)) {
        if (val[[1]]$control == "dataframe") {
          l_params[[1]][[update[i]]]$value[[1]]$source <- as.character(arg_value)
          l_params[[1]][[update[i]]]$value[[1]]$value <- eval(arg_value)
        } else {
          l_params[[1]][[update[i]]]$value[[1]]$value <- arg_value
        }
      } else if (!l_params[[1]][[update[[i]]]]$static) {
        l_params[[1]][[update[i]]]$value <- list(list(name = arg_value))
      } else {
        l_params[[1]][[update[i]]]$value <- arg_value
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

