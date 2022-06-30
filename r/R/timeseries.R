#' LSTM
#'
#' Predict using a long-short-term-memory model
#'
#' @param prediction 
#' @param window 
#' @param units 
#' @param epochs 
#' @param predictions 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_predict_lstm <- function(h, prediction, window, units, epochs, predictions, ...) {

  h9_add_step(
    h,
    "timelstm",
    list(
      ...
    )
  )

}

#' SMA
#'
#' Calculate the moving average
#'
#' @param source 
#' @param window 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_sma <- function(h, source, window, ...) {

  h9_add_step(
    h,
    "timemovingaverage",
    list(
      ...
    )
  )

}

