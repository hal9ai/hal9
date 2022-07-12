#' Assign
#'
#' Attach a new column
#'
#' @param h A h9 object created by h9_create.
#' @param column Name of the new column
#' @param array The array to be added to the table
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_assign <- function(h, column  = NULL, array  = NULL, ...) {
  h9_add_step(
    h,
    "assign",
    matched_call = as.list(match.call())
  )
}

#' Convert
#'
#' Apply an expression to the values in a specific column
#'
#' @param h A h9 object created by h9_create.
#' @param field The name of the column to convert
#' @param dataType The target data type
#' @param timeConverter an optional parameter to help convert date-times
#' @param charactersToRemove a string of characters to remove
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_convert <- function(h, field  = NULL, dataType  = NULL, timeConverter  = NULL, charactersToRemove  = NULL, ...) {
  h9_add_step(
    h,
    "convert",
    matched_call = as.list(match.call())
  )
}

#' Derive
#'
#' Create a new column or replace an existing one via an expression
#'
#' @param h A h9 object created by h9_create.
#' @param column The name of the new column. If this is a column that already exists in the dataframe, the derived column replaces the exisiting one.
#' @param expression The expression based on which the new columns are derived
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_derive <- function(h, column  = NULL, expression  = NULL, ...) {
  h9_add_step(
    h,
    "derive",
    matched_call = as.list(match.call())
  )
}

#' Drop
#'
#' Remove specific columns
#'
#' @param h A h9 object created by h9_create.
#' @param columns The list of columns to remove
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_drop <- function(h, columns  = NULL, ...) {
  h9_add_step(
    h,
    "drop",
    matched_call = as.list(match.call())
  )
}

#' Filter
#'
#' Keep only the rows that satisfy a given expression for a specific column
#'
#' @param h A h9 object created by h9_create.
#' @param field The column on which to filter
#' @param expression the criteria on which to filter the rows
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_filter <- function(h, field  = NULL, expression  = NULL, ...) {
  h9_add_step(
    h,
    "filter",
    matched_call = as.list(match.call())
  )
}

#' Fold
#'
#' Fold one or more columns into a pair of key-value columns
#'
#' @param h A h9 object created by h9_create.
#' @param gather the list of columns to convert into key-value pairs
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_fold <- function(h, gather  = NULL, ...) {
  h9_add_step(
    h,
    "fold",
    matched_call = as.list(match.call())
  )
}

#' Impute
#'
#' Fill in a column's missing data with the value of an aggregation
#'
#' @param h A h9 object created by h9_create.
#' @param field List of columns in which to replace missing values
#' @param method the function to use to impute the missing values. Currently available options are 'max', 'min', 'mean' median', 'zero'. Default is 'zero'
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_impute <- function(h, field  = NULL, method  = NULL, ...) {
  h9_add_step(
    h,
    "impute",
    matched_call = as.list(match.call())
  )
}

#' Pivot
#'
#' Pivot columns into a cross-tabulation
#'
#' @param h A h9 object created by h9_create.
#' @param rows The column whose unique values should serve as the rows of the new dataframe
#' @param columns The column whose unique values should serve as the columns of the new dataframe
#' @param values The columns whose values should be collected to serve as the individual cells of the table
#' @param summarizer the method to aggregate the collected values
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_pivot <- function(h, rows  = NULL, columns  = NULL, values  = NULL, summarizer  = NULL, ...) {
  h9_add_step(
    h,
    "pivot",
    matched_call = as.list(match.call())
  )
}

#' Rolling Sum
#'
#' Create new columns from the running totals of others
#'
#' @param h A h9 object created by h9_create.
#' @param column The column for which to calculate the rolling sum.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_roll_sum <- function(h, column  = NULL, ...) {
  h9_add_step(
    h,
    "rollingsum",
    matched_call = as.list(match.call())
  )
}

#' Sample
#'
#' Trim a dataset down to a random sample of its rows
#'
#' @param h A h9 object created by h9_create.
#' @param samplesize The size of the sample as a percentage of the size of the input dataframe
#' @param withReplacement Allow or disallow sampling of the same row more than once. Default- True
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_sample <- function(h, samplesize  = NULL, withReplacement  = NULL, ...) {
  h9_add_step(
    h,
    "sample",
    matched_call = as.list(match.call())
  )
}

#' Select
#'
#' Keep only a subset of columns
#'
#' @param h A h9 object created by h9_create.
#' @param columns The list of columns to keep
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_select <- function(h, columns  = NULL, ...) {
  h9_add_step(
    h,
    "select",
    matched_call = as.list(match.call())
  )
}

#' Slice
#'
#' Keep only a contiguous subset of rows
#'
#' @param h A h9 object created by h9_create.
#' @param start The starting index(included)
#' @param end The ending index(not included)
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_slice <- function(h, start  = NULL, end  = NULL, ...) {
  h9_add_step(
    h,
    "slice",
    matched_call = as.list(match.call())
  )
}

#' Sort
#'
#' Sort rows of data based on the values in selected columns
#'
#' @param h A h9 object created by h9_create.
#' @param field The list of columns to sort by
#' @param order The order in which to sort, default - ascending
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_sort <- function(h, field  = NULL, order  = NULL, ...) {
  h9_add_step(
    h,
    "sort",
    matched_call = as.list(match.call())
  )
}

#' Summarize
#'
#' Select columns to aggregate and others to keep unmodified
#'
#' @param h A h9 object created by h9_create.
#' @param group The list of columns by which to group
#' @param field The list of columns who's values to collect
#' @param summarizer The summarizer method to aggregate the values collected, default- count
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_summarize <- function(h, group  = NULL, field  = NULL, summarizer  = NULL, ...) {
  h9_add_step(
    h,
    "summarize",
    matched_call = as.list(match.call())
  )
}

