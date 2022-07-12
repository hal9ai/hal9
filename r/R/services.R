#' Airbnb
#'
#' Gather comments from an Airbnb listing by using a Hal9 server worker
#'
#' @param h A h9 object created by h9_create.
#' @param url 
#' @param maxReviews 
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
#' @param clientId 
#' @param projectNumber 
#' @param query 
#' @param dbLocation 
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
#' @param url 
#' @param documentAccess 
#' @param sheet 
#' @param clientId 
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
#' @param type 
#' @param sub 
#' @param query 
#' @param before 
#' @param after 
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
#' @param search 
#' @param key 
#' @param secret 
#' @param type 
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

