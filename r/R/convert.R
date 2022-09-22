h9_convert.default <- function(x, ...) {
  x
}

h9_convert.ggplot <- function(x, width = 6, height = 4, ...) {
  tfile <- tempfile(fileext = '.png')
  ggplot2::ggsave(tfile, x, width = width, height = height)
  base64enc::dataURI(file = tfile, mime = "image/png")
}

#' @export
h9_convert <- function (x, ...) {
  UseMethod("h9_convert", x)
}
