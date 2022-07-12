#' LSTM
#'
#' Predict using a long-short-term-memory model
#'
#' @param h A h9 object created by h9_create.
#' @param prediction Additional step parameter.
#' @param window Additional step parameter.
#' @param units Additional step parameter.
#' @param epochs Additional step parameter.
#' @param predictions Additional step parameter.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_predict_lstm <- function(h, prediction  = NULL, window  = NULL, units  = NULL, epochs  = NULL, predictions  = NULL, ...) {
  h9_add_step(
    h,
    "timelstm",
    matched_call = as.list(match.call())
  )
}

#' SMA
#'
#' Calculate the moving average
#'
#' @param h A h9 object created by h9_create.
#' @param source Additional step parameter.
#' @param window Additional step parameter.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_sma <- function(h, source  = NULL, window  = NULL, ...) {
  h9_add_step(
    h,
    "timemovingaverage",
    matched_call = as.list(match.call())
  )
}

