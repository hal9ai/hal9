#' Dropdown
#'
#' Embed a dropdown control
#'
#' @param uid Unique identifier for this element.
#' @param ... Other h9 parameters.
#'
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
#' @param uid Unique identifier for this element.
#' @param ... Other h9 parameters.
#'
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
#' @param uid Unique identifier for this element.
#' @param ... Other h9 parameters.
#'
#' @export
#'
h9_number <- function(uid, label  = NULL, ...) {
  node_args <- args[!names(args) %in% c("h", "", "uid")]
  do.call("h9_node", args = c(uid, node_args))
}

#' Slider
#'
#' Embed an slider element
#'
#' @param uid Unique identifier for this element.
#' @param ... Other h9 parameters.
#'
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
#' @param uid Unique identifier for this element.
#' @param ... Other h9 parameters.
#'
#' @export
#'
h9_textbox <- function(uid, label  = NULL, value  = NULL, ...) {
  node_args <- args[!names(args) %in% c("h", "", "uid")]
  do.call("h9_node", args = c(uid, node_args))
}

#' Website
#'
#' Embed a website and load a URL
#'
#' @param uid Unique identifier for this element.
#' @param ... Other h9 parameters.
#'
#' @export
#'
h9_website <- function(uid, site  = NULL, ...) {
  node_args <- args[!names(args) %in% c("h", "", "uid")]
  do.call("h9_node", args = c(uid, node_args))
}

