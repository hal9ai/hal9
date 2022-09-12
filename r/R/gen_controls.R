#' Dropdown
#'
#' Embed a dropdown control
#'
#' @param uid Unique identifier for this element
#' @param values Specifies the values for this dropdown
#' @param on_update Function to call when the value is changed updates
#' @param ... Other h9 parameters.
#'
#' @export
#'
h9_dropdown <- function(uid, values = NULL, on_update = NULL, ...) {
  args <- as.list(match.call()[-1])
  node_args <- args[!names(args) %in% c("h", "", "uid")]
  do.call("h9_node", args = c(uid, node_args))
}

#' File Input
#'
#' Embed a file input control
#'
#' @param uid Unique identifier for this element
#' @param dataType Specifies the dataType for this fileinput
#' @param on_update Function to call when the value is changed updates
#' @param ... Other h9 parameters.
#'
#' @export
#'
h9_file <- function(uid, dataType = NULL, on_update = NULL, ...) {
  args <- as.list(match.call()[-1])
  node_args <- args[!names(args) %in% c("h", "", "uid")]
  do.call("h9_node", args = c(uid, node_args))
}

#' Number Input
#'
#' Embed a number input control
#'
#' @param uid Unique identifier for this element
#' @param label Specifies the label for this numberinput
#' @param on_update Function to call when the value is changed updates
#' @param ... Other h9 parameters.
#'
#' @export
#'
h9_number <- function(uid, label = NULL, on_update = NULL, ...) {
  args <- as.list(match.call()[-1])
  node_args <- args[!names(args) %in% c("h", "", "uid")]
  do.call("h9_node", args = c(uid, node_args))
}

#' HTML
#'
#' Enables to render arbitrary HTML
#'
#' @param uid Unique identifier for this element
#' @param on_update Function to call when the value is changed updates
#' @param ... Other h9 parameters.
#'
#' @export
#'
h9_rawhtml <- function(uid, on_update = NULL, ...) {
  args <- as.list(match.call()[-1])
  node_args <- args[!names(args) %in% c("h", "", "uid")]
  do.call("h9_node", args = c(uid, node_args))
}

#' Slider
#'
#' Embed an slider element
#'
#' @param uid Unique identifier for this element
#' @param value Specifies the value for this slider
#' @param min Specifies the min for this slider
#' @param max Specifies the max for this slider
#' @param step Specifies the step for this slider
#' @param on_update Function to call when the value is changed updates
#' @param ... Other h9 parameters.
#'
#' @export
#'
h9_slider <- function(uid, value = NULL, min = NULL, max = NULL, step = NULL, on_update = NULL, ...) {
  args <- as.list(match.call()[-1])
  node_args <- args[!names(args) %in% c("h", "", "uid")]
  do.call("h9_node", args = c(uid, node_args))
}

#' Text Input
#'
#' Embed a text input control
#'
#' @param uid Unique identifier for this element
#' @param label Specifies the label for this textbox
#' @param value Specifies the value for this textbox
#' @param on_update Function to call when the value is changed updates
#' @param ... Other h9 parameters.
#'
#' @export
#'
h9_textbox <- function(uid, label = NULL, value = NULL, on_update = NULL, ...) {
  args <- as.list(match.call()[-1])
  node_args <- args[!names(args) %in% c("h", "", "uid")]
  do.call("h9_node", args = c(uid, node_args))
}

#' Multi-line Text Input
#'
#' Embed a multi-line text input control
#'
#' @param uid Unique identifier for this element
#' @param on_update Function to call when the value is changed updates
#' @param ... Other h9 parameters.
#'
#' @export
#'
h9_textarea <- function(uid, on_update = NULL, ...) {
  args <- as.list(match.call()[-1])
  node_args <- args[!names(args) %in% c("h", "", "uid")]
  do.call("h9_node", args = c(uid, node_args))
}

