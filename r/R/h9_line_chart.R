#' Add hal9 line chart step
#'
#' @param h A hal9 pipeline
#' @param x (optional) Character. Variable name for x axis
#' @param y (optional) Character. Variable name for y axis
#' @param color (optional) Character. Variable name for color
#' @param pallette (optional) Character. Color pallete if color is used
#' @param ... Unsupported. Used to pass direct parameters do hal9_add_step
#'
#' @return
#' @export
#'
#' @examples
h9_scatter_chart <- function(h, ...){

  h9_add_step(
    h,
    "linechart",
    list(
      ...
    )
  )

}
