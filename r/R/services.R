#' Airbnb
#'
#' Gather comments from an Airbnb listing by using a Hal9 server worker
#'
#' @param h A h9 object created by h9_create.
#' @param url Additional step parameter.
#' @param maxReviews Additional step parameter.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_import_airbnb <- function(h, url  = NULL, maxReviews  = NULL, ...) {
  h9_add_step(
    h,
    "airbnb",
    matched_call = as.list(match.call())
  )
}

#' BigQuery
#'
#' Query data from a Google Cloud BigQuery data warehouse
#'
#' @param h A h9 object created by h9_create.
#' @param clientId Additional step parameter.
#' @param projectNumber Additional step parameter.
#' @param query Additional step parameter.
#' @param dbLocation Additional step parameter.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_import_bigquery <- function(h, clientId  = NULL, projectNumber  = NULL, query  = NULL, dbLocation  = NULL, ...) {
  h9_add_step(
    h,
    "bigquery",
    matched_call = as.list(match.call())
  )
}

#' Google Sheets
#'
#' Import data from a Google Sheets spreadsheet
#'
#' @param h A h9 object created by h9_create.
#' @param url Additional step parameter.
#' @param documentAccess Additional step parameter.
#' @param sheet Additional step parameter.
#' @param clientId Additional step parameter.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_import_sheet <- function(h, url  = NULL, documentAccess  = NULL, sheet  = NULL, clientId  = NULL, ...) {
  h9_add_step(
    h,
    "googlesheets",
    matched_call = as.list(match.call())
  )
}

#' Reddit
#'
#' Search Reddit for submissions or comments
#'
#' @param h A h9 object created by h9_create.
#' @param type Additional step parameter.
#' @param sub Additional step parameter.
#' @param query Additional step parameter.
#' @param before Additional step parameter.
#' @param after Additional step parameter.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_import_reddit <- function(h, type  = NULL, sub  = NULL, query  = NULL, before  = NULL, after  = NULL, ...) {
  h9_add_step(
    h,
    "reddit",
    matched_call = as.list(match.call())
  )
}

#' Twitter
#'
#' Search Twitter with a Hal9 server worker
#'
#' @param h A h9 object created by h9_create.
#' @param search Additional step parameter.
#' @param key Additional step parameter.
#' @param secret Additional step parameter.
#' @param type Additional step parameter.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_import_twitter <- function(h, search  = NULL, key  = NULL, secret  = NULL, type  = NULL, ...) {
  h9_add_step(
    h,
    "twitter",
    matched_call = as.list(match.call())
  )
}

