#' Image Classification
#'
#' Use MobileNet's Image Classification to attempt to identify what's in an image
#'
#' @param h A h9 object created by h9_create.
#' @param url 
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_classify_image <- function(h, url  = NULL, ...) {
  h9_add_step(
    h,
    "mobilenet",
    matched_call = as.list(match.call())
  )
}

#' Pose
#'
#' Apply automated post-process motion capture dots to an image
#'
#' @param h A h9 object created by h9_create.
#' @param images 
#' @param model 
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_estimate_pose <- function(h, images  = NULL, model  = NULL, ...) {
  h9_add_step(
    h,
    "bodypix",
    matched_call = as.list(match.call())
  )
}

#' Sentiment
#'
#' Ask a neural net to predict how positively the text in a dataset will be perceived
#'
#' @param h A h9 object created by h9_create.
#' @param sentiment 
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_predict_sentiment <- function(h, sentiment  = NULL, ...) {
  h9_add_step(
    h,
    "sentiment",
    matched_call = as.list(match.call())
  )
}

