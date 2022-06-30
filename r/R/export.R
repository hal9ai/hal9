#' Text
#'
#' Export a dataset into a delimited string
#'
#' @param field 
#' @param separator 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_export_text <- function(h, field, separator, ...) {

  h9_add_step(
    h,
    "exporttext",
    list(
      ...
    )
  )

}

