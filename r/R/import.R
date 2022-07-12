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
#' @param file Additional step parameter.
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
#' @param file Additional step parameter.
#' @param extract Additional step parameter.
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

#' SQLite
#'
#' Query data from a SQLite database
#'
#' @param h A h9 object created by h9_create.
#' @param file Additional step parameter.
#' @param query Additional step parameter.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_read_sqlite <- function(h, file  = NULL, query  = NULL, ...) {
  h9_add_step(
    h,
    "sqlite",
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

