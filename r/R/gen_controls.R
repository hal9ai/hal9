#' Checkbox
#'
#' Embed a checkbox control
#'
#' @param uid Unique identifier for this element
#' @param label Specifies the label for this checkbox
#' @param checked Specifies the checked for this checkbox
#' @param on_update Function to call when the value is changed updates
#' @param ... Other h9 parameters.
#'
#' @export
#'
h9_checkbox <- function(uid, label = NULL, checked = NULL, on_update = NULL, ...) {
  args <- as.list(match.call()[-1])
  node_args <- args[!names(args) %in% c("h", "", "uid")]
  do.call("h9_node", args = c(uid, node_args))
}

#' Dropdown
#'
#' Embed a dropdown control
#'
#' @param uid Unique identifier for this element
#' @param values Specifies the values for this dropdown
#' @param value Specifies the value for this dropdown
#' @param on_update Function to call when the value is changed updates
#' @param ... Other h9 parameters.
#'
#' @export
#'
h9_dropdown <- function(uid, values = NULL, value = NULL, on_update = NULL, ...) {
  args <- as.list(match.call()[-1])
  node_args <- args[!names(args) %in% c("h", "", "uid")]
  do.call("h9_node", args = c(uid, node_args))
}

#' File
#'
#' Embed a file input control
#'
#' @param uid Unique identifier for this element
#' @param caption Specifies the caption for this fileinput
#' @param dragDrop Specifies the dragDrop for this fileinput
#' @param on_update Function to call when the value is changed updates
#' @param ... Other h9 parameters.
#'
#' @export
#'
h9_file <- function(uid, caption = NULL, dragDrop = NULL, on_update = NULL, ...) {
  args <- as.list(match.call()[-1])
  node_args <- args[!names(args) %in% c("h", "", "uid")]
  do.call("h9_node", args = c(uid, node_args))
}

#' Image
#'
#' Embed an image from url or data
#'
#' @param uid Unique identifier for this element
#' @param image Specifies the image for this image
#' @param on_update Function to call when the value is changed updates
#' @param ... Other h9 parameters.
#'
#' @export
#'
h9_image <- function(uid, image = NULL, on_update = NULL, ...) {
  args <- as.list(match.call()[-1])
  node_args <- args[!names(args) %in% c("h", "", "uid")]
  do.call("h9_node", args = c(uid, node_args))
}

#' Message
#'
#' Embed a message element
#'
#' @param uid Unique identifier for this element
#' @param message Specifies the message for this message
#' @param title Specifies the title for this message
#' @param mtype Specifies the mtype for this message
#' @param showIcon Specifies the showIcon for this message
#' @param on_update Function to call when the value is changed updates
#' @param ... Other h9 parameters.
#'
#' @export
#'
h9_message <- function(uid, message = NULL, title = NULL, mtype = NULL, showIcon = NULL, on_update = NULL, ...) {
  args <- as.list(match.call()[-1])
  node_args <- args[!names(args) %in% c("h", "", "uid")]
  do.call("h9_node", args = c(uid, node_args))
}

#' Number
#'
#' Embed a number input control
#'
#' @param uid Unique identifier for this element
#' @param label Specifies the label for this numberinput
#' @param value Specifies the value for this numberinput
#' @param on_update Function to call when the value is changed updates
#' @param ... Other h9 parameters.
#'
#' @export
#'
h9_number <- function(uid, label = NULL, value = NULL, on_update = NULL, ...) {
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
h9_html <- function(uid, on_update = NULL, ...) {
  args <- as.list(match.call()[-1])
  node_args <- args[!names(args) %in% c("h", "", "uid")]
  do.call("h9_node", args = c(uid, node_args))
}

#' Markdown
#'
#' Enables to render arbitrary markdown
#'
#' @param uid Unique identifier for this element
#' @param markdown Specifies the markdown for this md
#' @param on_update Function to call when the value is changed updates
#' @param ... Other h9 parameters.
#'
#' @export
#'
h9_markdown <- function(uid, markdown = NULL, on_update = NULL, ...) {
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

#' Textbox
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

#' Textarea
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

