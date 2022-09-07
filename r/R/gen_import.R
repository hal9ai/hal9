#' CSV
#'
#' Import a CSV formatted dataset
#'
#' @param h An optional h9 object created by h9_create.
#' @param file Either the URL for the csv or a local file.
#' @param separator A single-character delimiter string between column values (default ',')
#' @param skip The number of lines to skip (default 0) before reading data
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_read_csv <- function(h = NULL, file  = NULL, separator  = NULL, skip  = NULL, ...) {
  if (identical(h, NULL)) h <- h9_default()

  args <- as.list(match.call())

  h9_add_step(
    h,
    "importcsv",
    matched_call = args
  )
}

#' Excel
#'
#' Import a dataset from a sheet of an Excel file
#'
#' @param h An optional h9 object created by h9_create.
#' @param file Additional step parameter.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_read_excel <- function(h = NULL, file  = NULL, ...) {
  if (identical(h, NULL)) h <- h9_default()

  args <- as.list(match.call())

  h9_add_step(
    h,
    "importexcel",
    matched_call = args
  )
}

#' JSON
#'
#' Import a JSON formatted dataset
#'
#' @param h An optional h9 object created by h9_create.
#' @param file Additional step parameter.
#' @param extract Additional step parameter.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_read_json <- function(h = NULL, file  = NULL, extract  = NULL, ...) {
  if (identical(h, NULL)) h <- h9_default()

  args <- as.list(match.call())

  h9_add_step(
    h,
    "importjson",
    matched_call = args
  )
}

#' SQLite
#'
#' Query data from a SQLite database
#'
#' @param h An optional h9 object created by h9_create.
#' @param file Additional step parameter.
#' @param query Additional step parameter.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_read_sqlite <- function(h = NULL, file  = NULL, query  = NULL, ...) {
  if (identical(h, NULL)) h <- h9_default()

  args <- as.list(match.call())

  h9_add_step(
    h,
    "sqlite",
    matched_call = args
  )
}

#' DataFrame
#'
#' Loads a dataframe
#'
#' @param h An optional h9 object created by h9_create.
#' @param dataset The dataframe to load
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_load <- function(h = NULL, dataset  = NULL, ...) {
  if (identical(h, NULL)) h <- h9_default()

  args <- as.list(match.call())

  h9_add_step(
    h,
    "dataframe",
    matched_call = args
  )
}

