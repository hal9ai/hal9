#' Airbnb
#'
#' Gather comments from an Airbnb listing by using a Hal9 server worker
#'
#' @param h A h9 object created by h9_create.
#' @param url 
#' @param maxReviews 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_import_airbnb <- function(h, url  = NULL, maxReviews  = NULL, ...) {

  h9_add_step(
    h,
    "airbnb",
    update = list(
      url = url,
      maxReviews = maxReviews,
      ...
    )
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
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_import_bigquery <- function(h, clientId  = NULL, projectNumber  = NULL, query  = NULL, dbLocation  = NULL, ...) {

  h9_add_step(
    h,
    "bigquery",
    update = list(
      clientId = clientId,
      projectNumber = projectNumber,
      query = query,
      dbLocation = dbLocation,
      ...
    )
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
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_import_sheet <- function(h, url  = NULL, documentAccess  = NULL, sheet  = NULL, clientId  = NULL, ...) {

  h9_add_step(
    h,
    "googlesheets",
    update = list(
      url = url,
      documentAccess = documentAccess,
      sheet = sheet,
      clientId = clientId,
      ...
    )
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
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_import_reddit <- function(h, type  = NULL, sub  = NULL, query  = NULL, before  = NULL, after  = NULL, ...) {

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
    )
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
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_import_twitter <- function(h, search  = NULL, key  = NULL, secret  = NULL, type  = NULL, ...) {

  h9_add_step(
    h,
    "twitter",
    update = list(
      search = search,
      key = key,
      secret = secret,
      type = type,
      ...
    )
  )

}

