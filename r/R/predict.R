#' Image Classification
#'
#' Use MobileNet's Image Classification to attempt to identify what's in an image
#'
#' @param h A h9 object created by h9_create.
#' @param url 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_classify_image <- function(h, url  = NULL, ...) {

  h9_add_step(
    h,
    "mobilenet",
    update = list(
      url = url,
      ...
    )
  )

}

#' Pose
#'
#' Apply automated post-process motion capture dots to an image
#'
#' @param h A h9 object created by h9_create.
#' @param images 
#' @param model 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_estimate_pose <- function(h, images  = NULL, model  = NULL, ...) {

  h9_add_step(
    h,
    "bodypix",
    update = list(
      images = images,
      model = model,
      ...
    )
  )

}

#' Regression
#'
#' Fit a regression model to a dataset to predict future values
#'
#' @param h A h9 object created by h9_create.
#' @param x 
#' @param y 
#' @param type 
#' @param predictions 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_regression_model <- function(h, x  = NULL, y  = NULL, type  = NULL, predictions  = NULL, ...) {

  h9_add_step(
    h,
    "regressionpredict",
    update = list(
      x = x,
      y = y,
      type = type,
      predictions = predictions,
      ...
    )
  )

}

#' Sentiment
#'
#' Ask a neural net to predict how positively the text in a dataset will be perceived
#'
#' @param h A h9 object created by h9_create.
#' @param sentiment 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_predict_sentiment <- function(h, sentiment  = NULL, ...) {

  h9_add_step(
    h,
    "sentiment",
    update = list(
      sentiment = sentiment,
      ...
    )
  )

}

