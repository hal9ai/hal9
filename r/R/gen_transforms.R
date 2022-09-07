#' Assign
#'
#' Attach a new column
#'
#' @param h An optional h9 object created by h9_create.
#' @param column Name of the new column
#' @param array The array to be added to the table
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_assign <- function(h = NULL, column  = NULL, array  = NULL, ...) {
  if (identical(h, NULL)) h <- h9_default()

  args <- as.list(match.call())

  h9_add_step(
    h,
    "assign",
    matched_call = args
  )
}

#' Convert
#'
#' Apply an expression to the values in a specific column
#'
#' @param h An optional h9 object created by h9_create.
#' @param field The name of the column to convert
#' @param dataType The target data type
#' @param timeConverter an optional parameter to help convert date-times
#' @param charactersToRemove a string of characters to remove
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_convert <- function(h = NULL, field  = NULL, dataType  = NULL, timeConverter  = NULL, charactersToRemove  = NULL, ...) {
  if (identical(h, NULL)) h <- h9_default()

  args <- as.list(match.call())

  h9_add_step(
    h,
    "convert",
    matched_call = args
  )
}

#' Derive
#'
#' Create a new column or replace an existing one via an expression
#'
#' @param h An optional h9 object created by h9_create.
#' @param column The name of the new column. If this is a column that already exists in the dataframe, the derived column replaces the exisiting one.
#' @param expression The expression based on which the new columns are derived
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_derive <- function(h = NULL, column  = NULL, expression  = NULL, ...) {
  if (identical(h, NULL)) h <- h9_default()

  args <- as.list(match.call())

  h9_add_step(
    h,
    "derive",
    matched_call = args
  )
}

#' Drop
#'
#' Remove specific columns
#'
#' @param h An optional h9 object created by h9_create.
#' @param columns The list of columns to remove
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_drop <- function(h = NULL, columns  = NULL, ...) {
  if (identical(h, NULL)) h <- h9_default()

  args <- as.list(match.call())

  h9_add_step(
    h,
    "drop",
    matched_call = args
  )
}

#' Filter
#'
#' Keep only the rows that satisfy a given expression for a specific column
#'
#' @param h An optional h9 object created by h9_create.
#' @param field The column on which to filter
#' @param expression the criteria on which to filter the rows
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_filter <- function(h = NULL, field  = NULL, expression  = NULL, ...) {
  if (identical(h, NULL)) h <- h9_default()

  args <- as.list(match.call())

  h9_add_step(
    h,
    "filter",
    matched_call = args
  )
}

#' Fold
#'
#' Fold one or more columns into a pair of key-value columns
#'
#' @param h An optional h9 object created by h9_create.
#' @param gather the list of columns to convert into key-value pairs
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_fold <- function(h = NULL, gather  = NULL, ...) {
  if (identical(h, NULL)) h <- h9_default()

  args <- as.list(match.call())

  h9_add_step(
    h,
    "fold",
    matched_call = args
  )
}

#' Impute
#'
#' Fill in a column's missing data with the value of an aggregation
#'
#' @param h An optional h9 object created by h9_create.
#' @param field List of columns in which to replace missing values
#' @param method the function to use to impute the missing values. Currently available options are 'max', 'min', 'mean' median', 'zero'. Default is 'zero'
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_impute <- function(h = NULL, field  = NULL, method  = NULL, ...) {
  if (identical(h, NULL)) h <- h9_default()

  args <- as.list(match.call())

  h9_add_step(
    h,
    "impute",
    matched_call = args
  )
}

#' Pivot
#'
#' Pivot columns into a cross-tabulation
#'
#' @param h An optional h9 object created by h9_create.
#' @param rows The column whose unique values should serve as the rows of the new dataframe
#' @param columns The column whose unique values should serve as the columns of the new dataframe
#' @param values The columns whose values should be collected to serve as the individual cells of the table
#' @param summarizer the method to aggregate the collected values
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_pivot <- function(h = NULL, rows  = NULL, columns  = NULL, values  = NULL, summarizer  = NULL, ...) {
  if (identical(h, NULL)) h <- h9_default()

  args <- as.list(match.call())

  h9_add_step(
    h,
    "pivot",
    matched_call = args
  )
}

#' Rolling Sum
#'
#' Create new columns from the running totals of others
#'
#' @param h An optional h9 object created by h9_create.
#' @param column The column for which to calculate the rolling sum.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_roll_sum <- function(h = NULL, column  = NULL, ...) {
  if (identical(h, NULL)) h <- h9_default()

  args <- as.list(match.call())

  h9_add_step(
    h,
    "rollingsum",
    matched_call = args
  )
}

#' Sample
#'
#' Trim a dataset down to a random sample of its rows
#'
#' @param h An optional h9 object created by h9_create.
#' @param samplesize The size of the sample as a percentage of the size of the input dataframe
#' @param withReplacement Allow or disallow sampling of the same row more than once. Default- True
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_sample <- function(h = NULL, samplesize  = NULL, withReplacement  = NULL, ...) {
  if (identical(h, NULL)) h <- h9_default()

  args <- as.list(match.call())

  h9_add_step(
    h,
    "sample",
    matched_call = args
  )
}

#' Select
#'
#' Keep only a subset of columns
#'
#' @param h An optional h9 object created by h9_create.
#' @param columns The list of columns to keep
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_select <- function(h = NULL, columns  = NULL, ...) {
  if (identical(h, NULL)) h <- h9_default()

  args <- as.list(match.call())

  h9_add_step(
    h,
    "select",
    matched_call = args
  )
}

#' Slice
#'
#' Keep only a contiguous subset of rows
#'
#' @param h An optional h9 object created by h9_create.
#' @param start The starting index(included)
#' @param end The ending index(not included)
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_slice <- function(h = NULL, start  = NULL, end  = NULL, ...) {
  if (identical(h, NULL)) h <- h9_default()

  args <- as.list(match.call())

  h9_add_step(
    h,
    "slice",
    matched_call = args
  )
}

#' Sort
#'
#' Sort rows of data based on the values in selected columns
#'
#' @param h An optional h9 object created by h9_create.
#' @param field The list of columns to sort by
#' @param order The order in which to sort, default - ascending
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_sort <- function(h = NULL, field  = NULL, order  = NULL, ...) {
  if (identical(h, NULL)) h <- h9_default()

  args <- as.list(match.call())

  h9_add_step(
    h,
    "sort",
    matched_call = args
  )
}

#' Summarize
#'
#' Select columns to aggregate and others to keep unmodified
#'
#' @param h An optional h9 object created by h9_create.
#' @param group The list of columns by which to group
#' @param field The list of columns who's values to collect
#' @param summarizer The summarizer method to aggregate the values collected, default- count
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_summarize <- function(h = NULL, group  = NULL, field  = NULL, summarizer  = NULL, ...) {
  if (identical(h, NULL)) h <- h9_default()

  args <- as.list(match.call())

  h9_add_step(
    h,
    "summarize",
    matched_call = args
  )
}

