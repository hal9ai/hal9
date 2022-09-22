#' @export
h9_convert.default <- function(x, ...) {
  x
}

#' @export
h9_convert.ggplot <- function(x, width = 6, height = 4, ...) {
  tfile <- tempfile(fileext = '.png')
  ggplot2::ggsave(tfile, x, width = width, height = height)
  base64enc::dataURI(file = tfile, mime = "image/png")
}

#' @export
h9_convert.htmlwidget <- function(x, ...) {
  tfile <- tempfile(fileext = '.html')
  htmlwidgets::saveWidget(x, tfile, selfcontained = TRUE)
  b64 <- base64enc::dataURI(file = tfile, mime = "text/html")
  paste0("<iframe src=\"", b64, "\" style=\"width: 100%; height: 100%\"></iframe>")
}

#' @export
h9_convert <- function (x, ...) {
  UseMethod("h9_convert", x)
}
