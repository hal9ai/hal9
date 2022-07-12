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
  matched_call <- as.list(match.call())

  h9_add_step(
    h,
    "importcsv",
    update = list(
      file = file,
      separator = separator,
      skip = skip,
      ...
    ),
    matched_call = matched_call
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
  matched_call <- as.list(match.call())

  h9_add_step(
    h,
    "importexcel",
    update = list(
      file = file,
      ...
    ),
    matched_call = matched_call
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
  matched_call <- as.list(match.call())

  h9_add_step(
    h,
    "importjson",
    update = list(
      file = file,
      extract = extract,
      ...
    ),
    matched_call = matched_call
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
h9_read_sqlite <- function(h, file  = NULL, query  = NULL, ...) {
  matched_call <- as.list(match.call())

  h9_add_step(
    h,
    "sqlite",
    update = list(
      file = file,
      query = query,
      ...
    ),
    matched_call = matched_call
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
  matched_call <- as.list(match.call())

  h9_add_step(
    h,
    "dataframe",
    update = list(
      dataset = dataset,
      ...
    ),
    matched_call = matched_call
  )

}

