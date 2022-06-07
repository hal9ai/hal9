
#' Publish hal9 app in RPubs
#'
#' @param hal9_expr R A hal9 htmlWidget
#' @param id	If this upload is an update of an existing document then the
#' id parameter should specify the document id to update. Note that the id
#' is provided as an element of the list returned by successful calls to
#' rpubsUpload.
#'
#' @export
#'
hal9_publish <- function(hal9_expr, title = "My hal9 app",
                         desc = NULL, id = NULL) {

  html_file <- hal9_to_rmd(
    hal9_expr,
    file = "hal9_app.html",
    title = title,
    desc = NULL
  )

  rsconnect::rpubsUpload(title, html_file, id)

}
