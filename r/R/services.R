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
  matched_call <- as.list(match.call())

  h9_add_step(
    h,
    "airbnb",
    update = list(
      url = url,
      maxReviews = maxReviews,
      ...
    ),
    matched_call = matched_call
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
  matched_call <- as.list(match.call())

  h9_add_step(
    h,
    "bigquery",
    update = list(
      clientId = clientId,
      projectNumber = projectNumber,
      query = query,
      dbLocation = dbLocation,
      ...
    ),
    matched_call = matched_call
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
  matched_call <- as.list(match.call())

  h9_add_step(
    h,
    "googlesheets",
    update = list(
      url = url,
      documentAccess = documentAccess,
      sheet = sheet,
      clientId = clientId,
      ...
    ),
    matched_call = matched_call
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
  matched_call <- as.list(match.call())

  h9_add_step(
    h,
    "reddit",
    update = list(
      type = type,
      sub = sub,
      query = query,
      before = before,
      after = after,
      ...
    ),
    matched_call = matched_call
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
  matched_call <- as.list(match.call())

  h9_add_step(
    h,
    "twitter",
    update = list(
      search = search,
      key = key,
      secret = secret,
      type = type,
      ...
    ),
    matched_call = matched_call
  )

}

