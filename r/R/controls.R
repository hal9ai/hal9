#' Dropdown
#'
#' Embed an HTML <select> element
#'
#' @param values 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_dropdown <- function(h, values, ...) {

  h9_add_step(
    h,
    "dropdown",
    list(
      ...
    )
  )

}

#' Website
#'
#' Embed a website and load a URL
#'
#' @param site 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_website <- function(h, site, ...) {

  h9_add_step(
    h,
    "website",
    list(
      ...
    )
  )

}

