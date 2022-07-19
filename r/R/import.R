#' CSV
#'
#' Import a CSV formatted dataset
#'
#' @param h A h9 object created by h9_create.
#' @param file Either the URL for the csv or a local file.
#' @param separator A single-character delimiter string between column values (default ',')
#' @param skip The number of lines to skip (default 0) before reading data
#' @param rebind A list of rebindings to apply to this function parameters.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_read_csv <- function(h, file  = NULL, separator  = NULL, skip  = NULL, rebind = NULL, ...) {

  args <- as.list(match.call())
  no_rebinds <- which(names(args) != "rebind")

  h9_add_step(
    h,
    "importcsv",
    rebind,
    matched_call = args[no_rebinds]
  )
}

#' Excel
#'
#' Import a dataset from a sheet of an Excel file
#'
#' @param h A h9 object created by h9_create.
#' @param file Additional step parameter.
#' @param rebind A list of rebindings to apply to this function parameters.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_read_excel <- function(h, file  = NULL, rebind = NULL, ...) {

  args <- as.list(match.call())
  no_rebinds <- which(names(args) != "rebind")

  h9_add_step(
    h,
    "importexcel",
    rebind,
    matched_call = args[no_rebinds]
  )
}

#' JSON
#'
#' Import a JSON formatted dataset
#'
#' @param h A h9 object created by h9_create.
#' @param file Additional step parameter.
#' @param extract Additional step parameter.
#' @param rebind A list of rebindings to apply to this function parameters.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_read_json <- function(h, file  = NULL, extract  = NULL, rebind = NULL, ...) {

  args <- as.list(match.call())
  no_rebinds <- which(names(args) != "rebind")

  h9_add_step(
    h,
    "importjson",
    rebind,
    matched_call = args[no_rebinds]
  )
}

#' SQLite
#'
#' Query data from a SQLite database
#'
#' @param h A h9 object created by h9_create.
#' @param file Additional step parameter.
#' @param query Additional step parameter.
#' @param rebind A list of rebindings to apply to this function parameters.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_read_sqlite <- function(h, file  = NULL, query  = NULL, rebind = NULL, ...) {

  args <- as.list(match.call())
  no_rebinds <- which(names(args) != "rebind")

  h9_add_step(
    h,
    "sqlite",
    rebind,
    matched_call = args[no_rebinds]
  )
}

#' DataFrame
#'
#' Loads a dataframe
#'
#' @param h A h9 object created by h9_create.
#' @param dataset The dataframe to load
#' @param rebind A list of rebindings to apply to this function parameters.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_load <- function(h, dataset  = NULL, rebind = NULL, ...) {

  args <- as.list(match.call())
  no_rebinds <- which(names(args) != "rebind")

  h9_add_step(
    h,
    "dataframe",
    rebind,
    matched_call = args[no_rebinds]
  )
}

