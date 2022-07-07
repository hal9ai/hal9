#' LSTM
#'
#' Predict using a long-short-term-memory model
#'
#' @param h A h9 object created by h9_create.
#' @param prediction 
#' @param window 
#' @param units 
#' @param epochs 
#' @param predictions 
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_predict_lstm <- function(h, prediction  = NULL, window  = NULL, units  = NULL, epochs  = NULL, predictions  = NULL, ...) {

  h9_add_step(
    h,
    "timelstm",
    update = list(
      prediction = prediction,
      window = window,
      units = units,
      epochs = epochs,
      predictions = predictions,
      ...
    )
  )

}

#' SMA
#'
#' Calculate the moving average
#'
#' @param h A h9 object created by h9_create.
#' @param source 
#' @param window 
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_sma <- function(h, source  = NULL, window  = NULL, ...) {

  h9_add_step(
    h,
    "timemovingaverage",
    update = list(
      source = source,
      window = window,
      ...
    )
  )

}

