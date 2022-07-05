#' Text
#'
#' Export a dataset into a delimited string
#'
#' @param h A h9 object created by h9_create.
#' @param field 
#' @param separator 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_export_text <- function(h, field  = NULL, separator  = NULL, ...) {

  h9_add_step(
    h,
    "exporttext",
    update = list(
      field = field,
      separator = separator,
      ...
    )
  )

}

