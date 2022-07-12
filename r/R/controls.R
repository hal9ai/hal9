#' Slider
#'
#' Embed an slider element
#'
#' @param h A h9 object created by h9_create.
#' @param min 
#' @param max 
#' @param step 
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_slider <- function(h, min  = NULL, max  = NULL, step  = NULL, ...) {
  matched_call <- as.list(match.call())

  h9_add_step(
    h,
    "slider",
    update = list(
      min = min,
      max = max,
      step = step,
      ...
    ),
    matched_call = matched_call
  )

}

#' Website
#'
#' Embed a website and load a URL
#'
#' @param h A h9 object created by h9_create.
#' @param site 
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_website <- function(h, site  = NULL, ...) {
  matched_call <- as.list(match.call())

  h9_add_step(
    h,
    "website",
    update = list(
      site = site,
      ...
    ),
    matched_call = matched_call
  )

}

