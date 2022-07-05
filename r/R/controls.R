#' Dropdown
#'
#' Embed an HTML <select> element
#'
#' @param h A h9 object created by h9_create.
#' @param values 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_dropdown <- function(h, values  = NULL, ...) {

  h9_add_step(
    h,
    "dropdown",
    update = list(
      values = values,
      ...
    )
  )

}

#' Website
#'
#' Embed a website and load a URL
#'
#' @param h A h9 object created by h9_create.
#' @param site 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_website <- function(h, site  = NULL, ...) {

  h9_add_step(
    h,
    "website",
    update = list(
      site = site,
      ...
    )
  )

}

