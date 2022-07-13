#' Dropdown
#'
#' Embed an HTML <select> element
#'
#' @param h A h9 object created by h9_create.
#' @param values Additional step parameter.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_dropdown <- function(h, values  = NULL, ...) {
  h9_add_step(
    h,
    "dropdown",
    matched_call = as.list(match.call())
  )
}

#' Slider
#'
#' Embed an slider element
#'
#' @param h A h9 object created by h9_create.
#' @param min Additional step parameter.
#' @param max Additional step parameter.
#' @param step Additional step parameter.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_slider <- function(h, min  = NULL, max  = NULL, step  = NULL, ...) {
  h9_add_step(
    h,
    "slider",
    matched_call = as.list(match.call())
  )
}

#' Website
#'
#' Embed a website and load a URL
#'
#' @param h A h9 object created by h9_create.
#' @param site Additional step parameter.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_website <- function(h, site  = NULL, ...) {
  h9_add_step(
    h,
    "website",
    matched_call = as.list(match.call())
  )
}

