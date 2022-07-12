#' CSV
#'
#' Import a CSV formatted dataset
#'
#' @param h A h9 object created by h9_create.
#' @param file Either the URL for the csv or a local file.
#' @param separator A single-character delimiter string between column values (default ',')
#' @param skip The number of lines to skip (default 0) before reading data
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_read_csv <- function(h, file  = NULL, separator  = NULL, skip  = NULL, ...) {
  h9_add_step(
    h,
    "importcsv",
    matched_call = as.list(match.call())
  )
}

#' Excel
#'
#' Import a dataset from a sheet of an Excel file
#'
#' @param h A h9 object created by h9_create.
#' @param file 
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_read_excel <- function(h, file  = NULL, ...) {
  h9_add_step(
    h,
    "importexcel",
    matched_call = as.list(match.call())
  )
}

#' JSON
#'
#' Import a JSON formatted dataset
#'
#' @param h A h9 object created by h9_create.
#' @param file 
#' @param extract 
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_read_json <- function(h, file  = NULL, extract  = NULL, ...) {
  h9_add_step(
    h,
    "importjson",
    matched_call = as.list(match.call())
  )
}

#' GraphQL
#'
#' Query data from a GraphQL endpoint
#'
#' @param h A h9 object created by h9_create.
#' @param url 
#' @param query 
#' @param extract 
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_import_graphql <- function(h, url  = NULL, query  = NULL, extract  = NULL, ...) {
  h9_add_step(
    h,
    "graphql",
    matched_call = as.list(match.call())
  )
}

#' MySQL
#'
#' Query data from a MySQL database by using a Hal9 server worker
#'
#' @param h A h9 object created by h9_create.
#' @param host 
#' @param user 
#' @param password 
#' @param database 
#' @param query 
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_import_mysql <- function(h, host  = NULL, user  = NULL, password  = NULL, database  = NULL, query  = NULL, ...) {
  h9_add_step(
    h,
    "mysql",
    matched_call = as.list(match.call())
  )
}

#' Stocks
#'
#' Get stock market data provided by Financial Modeling Prep
#'
#' @param h A h9 object created by h9_create.
#' @param stock 
#' @param statistic 
#' @param limit 
#' @param apiKey 
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_import_stocks <- function(h, stock  = NULL, statistic  = NULL, limit  = NULL, apiKey  = NULL, ...) {
  h9_add_step(
    h,
    "stocks",
    matched_call = as.list(match.call())
  )
}

#' SQLite
#'
#' Query data from a SQLite database
#'
#' @param h A h9 object created by h9_create.
#' @param file 
#' @param query 
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_import_sqlite <- function(h, file  = NULL, query  = NULL, ...) {
  h9_add_step(
    h,
    "sqlite",
    matched_call = as.list(match.call())
  )
}

#' Video Frames
#'
#' Grab frames from a video file
#'
#' @param h A h9 object created by h9_create.
#' @param file 
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_import_video <- function(h, file  = NULL, ...) {
  h9_add_step(
    h,
    "videoframes",
    matched_call = as.list(match.call())
  )
}

#' Web Images
#'
#' Scrape images from a website by using a Hal9 server worker
#'
#' @param h A h9 object created by h9_create.
#' @param url 
#' @param minSize 
#' @param scrollIters 
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_webscrape_images <- function(h, url  = NULL, minSize  = NULL, scrollIters  = NULL, ...) {
  h9_add_step(
    h,
    "webimages",
    matched_call = as.list(match.call())
  )
}

#' Web Table
#'
#' Scrape a table from a website by using a Hal9 server worker
#'
#' @param h A h9 object created by h9_create.
#' @param url 
#' @param text 
#' @param hasHeader 
#' @param scrollIters 
#' @param scrollClick 
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_webscrape_table <- function(h, url  = NULL, text  = NULL, hasHeader  = NULL, scrollIters  = NULL, scrollClick  = NULL, ...) {
  h9_add_step(
    h,
    "webtables",
    matched_call = as.list(match.call())
  )
}

#' Web Selectors
#'
#' Scrape data matching CSS or DOM selectors on a website by using a Hal9 server worker
#'
#' @param h A h9 object created by h9_create.
#' @param url 
#' @param className 
#' @param columnName 
#' @param hasHeader 
#' @param scrollIters 
#' @param scrollClick 
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_webscrape_selectors <- function(h, url  = NULL, className  = NULL, columnName  = NULL, hasHeader  = NULL, scrollIters  = NULL, scrollClick  = NULL, ...) {
  h9_add_step(
    h,
    "webselector",
    matched_call = as.list(match.call())
  )
}

#' DataFrame
#'
#' Loads a dataframe
#'
#' @param h A h9 object created by h9_create.
#' @param dataset The dataframe to load
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_load <- function(h, dataset  = NULL, ...) {
  h9_add_step(
    h,
    "dataframe",
    matched_call = as.list(match.call())
  )
}

