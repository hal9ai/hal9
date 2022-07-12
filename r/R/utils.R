#' Stop
#'
#' Stops pipeline execution conditionally
#'
#' @param h A h9 object created by h9_create.
#' @param expression A JavaScript expression, which may use the 'outputs' dictionary which references outputs produced by previous steps by name.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_stop <- function(h, expression  = NULL, ...) {
  h9_add_step(
    h,
    "stop",
    matched_call = as.list(match.call())
  )
}

