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

  h9_add_step(
    h,
    "website",
    update = list(
      site = site,
      ...
    )
  )

}

