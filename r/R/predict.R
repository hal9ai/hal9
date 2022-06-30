#' Image Classification
#'
#' Use MobileNet's Image Classification to attempt to identify what's in an image
#'
#' @param url 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_classify_image <- function(h, url, ...) {

  h9_add_step(
    h,
    "mobilenet",
    list(
      ...
    )
  )

}

#' Pose
#'
#' Apply automated post-process motion capture dots to an image
#'
#' @param images 
#' @param model 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_estimate_pose <- function(h, images, model, ...) {

  h9_add_step(
    h,
    "bodypix",
    list(
      ...
    )
  )

}

#' Regression
#'
#' Fit a regression model to a dataset to predict future values
#'
#' @param x 
#' @param y 
#' @param type 
#' @param predictions 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_regression_model <- function(h, x, y, type, predictions, ...) {

  h9_add_step(
    h,
    "regressionpredict",
    list(
      ...
    )
  )

}

#' Sentiment
#'
#' Ask a neural net to predict how positively the text in a dataset will be perceived
#'
#' @param sentiment 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_predict_sentiment <- function(h, sentiment, ...) {

  h9_add_step(
    h,
    "sentiment",
    list(
      ...
    )
  )

}

