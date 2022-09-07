#' Dropdown
#'
#' Embed an HTML <select> element
#'
#' @param h An optional h9 object created by h9_create.
#' @param values Additional step parameter.
#' @param uid Unique identifier for this element.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_dropdown <- function(uid, values  = NULL, ...) {
  node_args <- args[!names(args) %in% c("h", "", "uid")]
  do.call("h9_node", args = c(uid, node_args))
}

#' File Input
#'
#' Embed a file input control
#'
#' @param h An optional h9 object created by h9_create.
#' @param dataType Additional step parameter.
#' @param uid Unique identifier for this element.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_file <- function(uid, dataType  = NULL, ...) {
  node_args <- args[!names(args) %in% c("h", "", "uid")]
  do.call("h9_node", args = c(uid, node_args))
}

#' Number Input
#'
#' Embed a number input control
#'
#' @param h An optional h9 object created by h9_create.
#' @param paramName Additional step parameter.
#' @param uid Unique identifier for this element.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_number <- function(uid, paramName  = NULL, ...) {
  node_args <- args[!names(args) %in% c("h", "", "uid")]
  do.call("h9_node", args = c(uid, node_args))
}

#' Slider
#'
#' Embed an slider element
#'
#' @param h An optional h9 object created by h9_create.
#' @param value Additional step parameter.
#' @param min Additional step parameter.
#' @param max Additional step parameter.
#' @param step Additional step parameter.
#' @param uid Unique identifier for this element.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_slider <- function(uid, value  = NULL, min  = NULL, max  = NULL, step  = NULL, ...) {
  node_args <- args[!names(args) %in% c("h", "", "uid")]
  do.call("h9_node", args = c(uid, node_args))
}

#' Text Input
#'
#' Embed a text input control
#'
#' @param h An optional h9 object created by h9_create.
#' @param label Additional step parameter.
#' @param value Additional step parameter.
#' @param uid Unique identifier for this element.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_textbox <- function(uid, label  = NULL, value  = NULL, ...) {
  node_args <- args[!names(args) %in% c("h", "", "uid")]
  do.call("h9_node", args = c(uid, node_args))
}

