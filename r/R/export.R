#' Text
#'
#' Export a dataset into a delimited string
#'
#' @param h A h9 object created by h9_create.
#' @param field 
#' @param separator 
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_export_text <- function(h, field  = NULL, separator  = NULL, ...) {
  matched_call <- as.list(match.call())

  h9_add_step(
    h,
    "exporttext",
    update = list(
      field = field,
      separator = separator,
      ...
    ),
    matched_call = matched_call
  )

}

