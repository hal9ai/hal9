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

