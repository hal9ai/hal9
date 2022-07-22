#' Dropdown
#'
#' Embed an HTML <select> element
#'
#' @param h A h9 object created by h9_create.
#' @param values Additional step parameter.
#' @param rebind A list of rebindings to apply to this function parameters.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_dropdown <- function(h, values  = NULL, rebind = NULL, ...) {

  args <- as.list(match.call())
  no_rebinds <- which(names(args) != "rebind")

  h9_add_step(
    h,
    "dropdown",
    rebind,
    matched_call = args[no_rebinds]
  )
}

#' Slider
#'
#' Embed an slider element
#'
#' @param h A h9 object created by h9_create.
#' @param value Additional step parameter.
#' @param min Additional step parameter.
#' @param max Additional step parameter.
#' @param step Additional step parameter.
#' @param rebind A list of rebindings to apply to this function parameters.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_slider <- function(h, value  = NULL, min  = NULL, max  = NULL, step  = NULL, rebind = NULL, ...) {

  args <- as.list(match.call())
  no_rebinds <- which(names(args) != "rebind")

  h9_add_step(
    h,
    "slider",
    rebind,
    matched_call = args[no_rebinds]
  )
}

#' Website
#'
#' Embed a website and load a URL
#'
#' @param h A h9 object created by h9_create.
#' @param site Additional step parameter.
#' @param rebind A list of rebindings to apply to this function parameters.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_website <- function(h, site  = NULL, rebind = NULL, ...) {

  args <- as.list(match.call())
  no_rebinds <- which(names(args) != "rebind")

  h9_add_step(
    h,
    "website",
    rebind,
    matched_call = args[no_rebinds]
  )
}

