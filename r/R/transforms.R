#' Assign
#'
#' Attach a new column
#'
#' @param h A h9 object created by h9_create.
#' @param column Name of the new column
#' @param array The array to be added to the table
#' @param rebind A list of rebindings to apply to this function parameters.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_assign <- function(h, column  = NULL, array  = NULL, rebind = NULL, ...) {

  args <- as.list(match.call())
  no_rebinds <- which(names(args) != "rebind")

  h9_add_step(
    h,
    "assign",
    rebind,
    matched_call = args[no_rebinds]
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
#' @param rebind A list of rebindings to apply to this function parameters.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_convert <- function(h, field  = NULL, dataType  = NULL, timeConverter  = NULL, charactersToRemove  = NULL, rebind = NULL, ...) {

  args <- as.list(match.call())
  no_rebinds <- which(names(args) != "rebind")

  h9_add_step(
    h,
    "convert",
    rebind,
    matched_call = args[no_rebinds]
  )
}

#' Derive
#'
#' Create a new column or replace an existing one via an expression
#'
#' @param h A h9 object created by h9_create.
#' @param column The name of the new column. If this is a column that already exists in the dataframe, the derived column replaces the exisiting one.
#' @param expression The expression based on which the new columns are derived
#' @param rebind A list of rebindings to apply to this function parameters.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_derive <- function(h, column  = NULL, expression  = NULL, rebind = NULL, ...) {

  args <- as.list(match.call())
  no_rebinds <- which(names(args) != "rebind")

  h9_add_step(
    h,
    "derive",
    rebind,
    matched_call = args[no_rebinds]
  )
}

#' Drop
#'
#' Remove specific columns
#'
#' @param h A h9 object created by h9_create.
#' @param columns The list of columns to remove
#' @param rebind A list of rebindings to apply to this function parameters.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_drop <- function(h, columns  = NULL, rebind = NULL, ...) {

  args <- as.list(match.call())
  no_rebinds <- which(names(args) != "rebind")

  h9_add_step(
    h,
    "drop",
    rebind,
    matched_call = args[no_rebinds]
  )
}

#' Filter
#'
#' Keep only the rows that satisfy a given expression for a specific column
#'
#' @param h A h9 object created by h9_create.
#' @param field The column on which to filter
#' @param expression the criteria on which to filter the rows
#' @param rebind A list of rebindings to apply to this function parameters.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_filter <- function(h, field  = NULL, expression  = NULL, rebind = NULL, ...) {

  args <- as.list(match.call())
  no_rebinds <- which(names(args) != "rebind")

  h9_add_step(
    h,
    "filter",
    rebind,
    matched_call = args[no_rebinds]
  )
}

#' Fold
#'
#' Fold one or more columns into a pair of key-value columns
#'
#' @param h A h9 object created by h9_create.
#' @param gather the list of columns to convert into key-value pairs
#' @param rebind A list of rebindings to apply to this function parameters.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_fold <- function(h, gather  = NULL, rebind = NULL, ...) {

  args <- as.list(match.call())
  no_rebinds <- which(names(args) != "rebind")

  h9_add_step(
    h,
    "fold",
    rebind,
    matched_call = args[no_rebinds]
  )
}

#' Impute
#'
#' Fill in a column's missing data with the value of an aggregation
#'
#' @param h A h9 object created by h9_create.
#' @param field List of columns in which to replace missing values
#' @param method the function to use to impute the missing values. Currently available options are 'max', 'min', 'mean' median', 'zero'. Default is 'zero'
#' @param rebind A list of rebindings to apply to this function parameters.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_impute <- function(h, field  = NULL, method  = NULL, rebind = NULL, ...) {

  args <- as.list(match.call())
  no_rebinds <- which(names(args) != "rebind")

  h9_add_step(
    h,
    "impute",
    rebind,
    matched_call = args[no_rebinds]
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
#' @param rebind A list of rebindings to apply to this function parameters.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_pivot <- function(h, rows  = NULL, columns  = NULL, values  = NULL, summarizer  = NULL, rebind = NULL, ...) {

  args <- as.list(match.call())
  no_rebinds <- which(names(args) != "rebind")

  h9_add_step(
    h,
    "pivot",
    rebind,
    matched_call = args[no_rebinds]
  )
}

#' Rolling Sum
#'
#' Create new columns from the running totals of others
#'
#' @param h A h9 object created by h9_create.
#' @param column The column for which to calculate the rolling sum.
#' @param rebind A list of rebindings to apply to this function parameters.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_roll_sum <- function(h, column  = NULL, rebind = NULL, ...) {

  args <- as.list(match.call())
  no_rebinds <- which(names(args) != "rebind")

  h9_add_step(
    h,
    "rollingsum",
    rebind,
    matched_call = args[no_rebinds]
  )
}

#' Sample
#'
#' Trim a dataset down to a random sample of its rows
#'
#' @param h A h9 object created by h9_create.
#' @param samplesize The size of the sample as a percentage of the size of the input dataframe
#' @param withReplacement Allow or disallow sampling of the same row more than once. Default- True
#' @param rebind A list of rebindings to apply to this function parameters.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_sample <- function(h, samplesize  = NULL, withReplacement  = NULL, rebind = NULL, ...) {

  args <- as.list(match.call())
  no_rebinds <- which(names(args) != "rebind")

  h9_add_step(
    h,
    "sample",
    rebind,
    matched_call = args[no_rebinds]
  )
}

#' Select
#'
#' Keep only a subset of columns
#'
#' @param h A h9 object created by h9_create.
#' @param columns The list of columns to keep
#' @param rebind A list of rebindings to apply to this function parameters.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_select <- function(h, columns  = NULL, rebind = NULL, ...) {

  args <- as.list(match.call())
  no_rebinds <- which(names(args) != "rebind")

  h9_add_step(
    h,
    "select",
    rebind,
    matched_call = args[no_rebinds]
  )
}

#' Slice
#'
#' Keep only a contiguous subset of rows
#'
#' @param h A h9 object created by h9_create.
#' @param start The starting index(included)
#' @param end The ending index(not included)
#' @param rebind A list of rebindings to apply to this function parameters.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_slice <- function(h, start  = NULL, end  = NULL, rebind = NULL, ...) {

  args <- as.list(match.call())
  no_rebinds <- which(names(args) != "rebind")

  h9_add_step(
    h,
    "slice",
    rebind,
    matched_call = args[no_rebinds]
  )
}

#' Sort
#'
#' Sort rows of data based on the values in selected columns
#'
#' @param h A h9 object created by h9_create.
#' @param field The list of columns to sort by
#' @param order The order in which to sort, default - ascending
#' @param rebind A list of rebindings to apply to this function parameters.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_sort <- function(h, field  = NULL, order  = NULL, rebind = NULL, ...) {

  args <- as.list(match.call())
  no_rebinds <- which(names(args) != "rebind")

  h9_add_step(
    h,
    "sort",
    rebind,
    matched_call = args[no_rebinds]
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
#' @param rebind A list of rebindings to apply to this function parameters.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_summarize <- function(h, group  = NULL, field  = NULL, summarizer  = NULL, rebind = NULL, ...) {

  args <- as.list(match.call())
  no_rebinds <- which(names(args) != "rebind")

  h9_add_step(
    h,
    "summarize",
    rebind,
    matched_call = args[no_rebinds]
  )
}

