#' Text
#'
#' Export a dataset into a delimited string
#'
#' @param h A h9 object created by h9_create.
#' @param field Additional step parameter.
#' @param separator Additional step parameter.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_export_text <- function(h, field  = NULL, separator  = NULL, ...) {
  h9_add_step(
    h,
    "exporttext",
    matched_call = as.list(match.call())
  )
}

