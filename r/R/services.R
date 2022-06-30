#' Airbnb
#'
#' Gather comments from an Airbnb listing by using a Hal9 server worker
#'
#' @param url 
#' @param maxReviews 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_import_airbnb <- function(h, url, maxReviews, ...) {

  h9_add_step(
    h,
    "airbnb",
    list(
      ...
    )
  )

}

#' BigQuery
#'
#' Query data from a Google Cloud BigQuery data warehouse
#'
#' @param clientId 
#' @param projectNumber 
#' @param query 
#' @param dbLocation 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_import_bigquery <- function(h, clientId, projectNumber, query, dbLocation, ...) {

  h9_add_step(
    h,
    "bigquery",
    list(
      ...
    )
  )

}

#' Google Sheets
#'
#' Import data from a Google Sheets spreadsheet
#'
#' @param url 
#' @param documentAccess 
#' @param sheet 
#' @param clientId 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_import_sheet <- function(h, url, documentAccess, sheet, clientId, ...) {

  h9_add_step(
    h,
    "googlesheets",
    list(
      ...
    )
  )

}

#' Reddit
#'
#' Search Reddit for submissions or comments
#'
#' @param type 
#' @param sub 
#' @param query 
#' @param before 
#' @param after 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_import_reddit <- function(h, type, sub, query, before, after, ...) {

  h9_add_step(
    h,
    "reddit",
    list(
      ...
    )
  )

}

#' Twitter
#'
#' Search Twitter with a Hal9 server worker
#'
#' @param search 
#' @param key 
#' @param secret 
#' @param type 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_import_twitter <- function(h, search, key, secret, type, ...) {

  h9_add_step(
    h,
    "twitter",
    list(
      ...
    )
  )

}

