#' Assign
#'
#' Attach a new column
#'
#' @param column Name of the new column
#' @param array The array to be added to the table
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_assign <- function(h, column, array, ...) {

  h9_add_step(
    h,
    "assign",
    list(
      ...
    )
  )

}

#' Convert
#'
#' Apply an expression to the values in a specific column
#'
#' @param field The name of the column to convert
#' @param dataType The target data type
#' @param timeConverter an optional parameter to help convert date-times
#' @param charactersToRemove a string of characters to remove
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_convert <- function(h, field, dataType, timeConverter, charactersToRemove, ...) {

  h9_add_step(
    h,
    "convert",
    list(
      ...
    )
  )

}

#' Derive
#'
#' Create a new column or replace an existing one via an expression
#'
#' @param column The name of the new column. If this is a column that already exists in the dataframe, the derived column replaces the exisiting one.
#' @param expression The expression based on which the new columns are derived
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_derive <- function(h, column, expression, ...) {

  h9_add_step(
    h,
    "derive",
    list(
      ...
    )
  )

}

#' Drop
#'
#' Remove specific columns
#'
#' @param columns The list of columns to remove
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_drop <- function(h, columns, ...) {

  h9_add_step(
    h,
    "drop",
    list(
      ...
    )
  )

}

#' Filter
#'
#' Keep only the rows that satisfy a given expression for a specific column
#'
#' @param field The column on which to filter
#' @param expression 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_filter <- function(h, field, expression, ...) {

  h9_add_step(
    h,
    "filter",
    list(
      ...
    )
  )

}

#' Fold
#'
#' Fold one or more columns into a pair of key-value columns
#'
#' @param gather the list of columns to convert into key-value pairs
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_fold <- function(h, gather, ...) {

  h9_add_step(
    h,
    "fold",
    list(
      ...
    )
  )

}

#' Impute
#'
#' Fill in a column's missing data with the value of an aggregation
#'
#' @param field List of columns in which to replace missing values
#' @param method the function to use to impute the missing values. Currently available options are 'max', 'min', 'mean' median', 'zero'. Default is 'zero'
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_impute <- function(h, field, method, ...) {

  h9_add_step(
    h,
    "impute",
    list(
      ...
    )
  )

}

#' Pivot
#'
#' Pivot columns into a cross-tabulation
#'
#' @param rows The column whose unique values should serve as the rows of the new dataframe
#' @param columns The column whose unique values should serve as the columns of the new dataframe
#' @param values The columns whose values should be collected to serve as the individual cells of the table
#' @param summarizer the method to aggregate the collected values
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_pivot <- function(h, rows, columns, values, summarizer, ...) {

  h9_add_step(
    h,
    "pivot",
    list(
      ...
    )
  )

}

#' Rolling Sum
#'
#' Create new columns from the running totals of others
#'
#' @param column The column for which to calculate the rolling sum.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_roll_sum <- function(h, column, ...) {

  h9_add_step(
    h,
    "rollingsum",
    list(
      ...
    )
  )

}

#' Sample
#'
#' Trim a dataset down to a random sample of its rows
#'
#' @param samplesize The size of the sample as a percentage of the size of the input dataframe
#' @param withReplacement Allow or disallow sampling of the same row more than once. Default- True
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_sample <- function(h, samplesize, withReplacement, ...) {

  h9_add_step(
    h,
    "sample",
    list(
      ...
    )
  )

}

#' Select
#'
#' Keep only a subset of columns
#'
#' @param columns The list of columns to keep
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_select <- function(h, columns, ...) {

  h9_add_step(
    h,
    "select",
    list(
      ...
    )
  )

}

#' Slice
#'
#' Keep only a contiguous subset of rows
#'
#' @param start The starting index(included)
#' @param end The ending index(not included)
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_slice <- function(h, start, end, ...) {

  h9_add_step(
    h,
    "slice",
    list(
      ...
    )
  )

}

#' Sort
#'
#' Sort rows of data based on the values in selected columns
#'
#' @param field The list of columns to sort by
#' @param order The order in which to sort, default - ascending
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_sort <- function(h, field, order, ...) {

  h9_add_step(
    h,
    "sort",
    list(
      ...
    )
  )

}

#' Summarize
#'
#' Select columns to aggregate and others to keep unmodified
#'
#' @param group The list of columns by which to group
#' @param field The list of columns who's values to collect
#' @param summarizer The summarizer method to aggregate the values collected, default- count
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_summarize <- function(h, group, field, summarizer, ...) {

  h9_add_step(
    h,
    "summarize",
    list(
      ...
    )
  )

}

#' Fetch
#'
#' Create new data columns by processing a URL column with a Hal9 server worker
#'
#' @param url 
#' @param resize 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_fetch <- function(h, url, resize, ...) {

  h9_add_step(
    h,
    "fetch",
    list(
      ...
    )
  )

}

