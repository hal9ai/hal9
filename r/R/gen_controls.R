#' Dropdown
#'
#' Embed an HTML <select> element
#'
#' @param h An optional h9 object created by h9_create.
#' @param values Additional step parameter.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_dropdown <- function(h = NULL, values  = NULL, ...) {
  if (identical(h, NULL)) h <- h9_default()

  args <- as.list(match.call())

  h9_add_step(
    h,
    "dropdown",
    matched_call = args
  )
}

#' File Input
#'
#' Embed a file input control
#'
#' @param h An optional h9 object created by h9_create.
#' @param dataType Additional step parameter.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_file <- function(h = NULL, dataType  = NULL, ...) {
  if (identical(h, NULL)) h <- h9_default()

  args <- as.list(match.call())

  h9_add_step(
    h,
    "fileinput",
    matched_call = args
  )
}

#' Number Input
#'
#' Embed a number input control
#'
#' @param h An optional h9 object created by h9_create.
#' @param label Additional step parameter.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_number <- function(h = NULL, label  = NULL, ...) {
  if (identical(h, NULL)) h <- h9_default()

  args <- as.list(match.call())

  h9_add_step(
    h,
    "numberinput",
    matched_call = args
  )
}

#' Slider
#'
#' Embed an slider element
#'
#' @param h An optional h9 object created by h9_create.
#' @param value Additional step parameter.
#' @param min Additional step parameter.
#' @param max Additional step parameter.
#' @param step Additional step parameter.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_slider <- function(h = NULL, value  = NULL, min  = NULL, max  = NULL, step  = NULL, ...) {
  if (identical(h, NULL)) h <- h9_default()

  args <- as.list(match.call())

  h9_add_step(
    h,
    "slider",
    matched_call = args
  )
}

#' Text Input
#'
#' Embed a text input control
#'
#' @param h An optional h9 object created by h9_create.
#' @param label Additional step parameter.
#' @param value Additional step parameter.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_textbox <- function(h = NULL, label  = NULL, value  = NULL, ...) {
  if (identical(h, NULL)) h <- h9_default()

  args <- as.list(match.call())

  h9_add_step(
    h,
    "textbox",
    matched_call = args
  )
}

#' Website
#'
#' Embed a website and load a URL
#'
#' @param h An optional h9 object created by h9_create.
#' @param site Additional step parameter.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_website <- function(h = NULL, site  = NULL, ...) {
  if (identical(h, NULL)) h <- h9_default()

  args <- as.list(match.call())

  h9_add_step(
    h,
    "website",
    matched_call = args
  )
}

