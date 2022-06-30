#' CSV
#'
#' Import a CSV formatted dataset
#'
#' @param file Either the URL for the csv or a local file.
#' @param separator A single-character delimiter string between column values (default ',')
#' @param skip The number of lines to skip (default 0) before reading data
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_read_csv <- function(h, file, separator, skip, ...) {

  h9_add_step(
    h,
    "importcsv",
    list(
      ...
    )
  )

}

#' Excel
#'
#' Import a dataset from a sheet of an Excel file
#'
#' @param file 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_read_excel <- function(h, file, ...) {

  h9_add_step(
    h,
    "importexcel",
    list(
      ...
    )
  )

}

#' JSON
#'
#' Import a JSON formatted dataset
#'
#' @param file 
#' @param extract 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_read_json <- function(h, file, extract, ...) {

  h9_add_step(
    h,
    "importjson",
    list(
      ...
    )
  )

}

#' GraphQL
#'
#' Query data from a GraphQL endpoint
#'
#' @param url 
#' @param query 
#' @param extract 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_import_graphql <- function(h, url, query, extract, ...) {

  h9_add_step(
    h,
    "graphql",
    list(
      ...
    )
  )

}

#' MySQL
#'
#' Query data from a MySQL database by using a Hal9 server worker
#'
#' @param host 
#' @param user 
#' @param password 
#' @param database 
#' @param query 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_import_mysql <- function(h, host, user, password, database, query, ...) {

  h9_add_step(
    h,
    "mysql",
    list(
      ...
    )
  )

}

#' Stocks
#'
#' Get stock market data provided by Financial Modeling Prep
#'
#' @param stock 
#' @param statistic 
#' @param limit 
#' @param apiKey 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_import_stocks <- function(h, stock, statistic, limit, apiKey, ...) {

  h9_add_step(
    h,
    "stocks",
    list(
      ...
    )
  )

}

#' SQLite
#'
#' Query data from a SQLite database
#'
#' @param file 
#' @param query 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_import_sqlite <- function(h, file, query, ...) {

  h9_add_step(
    h,
    "sqlite",
    list(
      ...
    )
  )

}

#' Video Frames
#'
#' Grab frames from a video file
#'
#' @param file 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_import_video <- function(h, file, ...) {

  h9_add_step(
    h,
    "videoframes",
    list(
      ...
    )
  )

}

#' Web Images
#'
#' Scrape images from a website by using a Hal9 server worker
#'
#' @param url 
#' @param minSize 
#' @param scrollIters 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_webscrape_images <- function(h, url, minSize, scrollIters, ...) {

  h9_add_step(
    h,
    "webimages",
    list(
      ...
    )
  )

}

#' Web Table
#'
#' Scrape a table from a website by using a Hal9 server worker
#'
#' @param url 
#' @param text 
#' @param hasHeader 
#' @param scrollIters 
#' @param scrollClick 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_webscrape_table <- function(h, url, text, hasHeader, scrollIters, scrollClick, ...) {

  h9_add_step(
    h,
    "webtables",
    list(
      ...
    )
  )

}

#' Web Selectors
#'
#' Scrape data matching CSS or DOM selectors on a website by using a Hal9 server worker
#'
#' @param url 
#' @param className 
#' @param columnName 
#' @param hasHeader 
#' @param scrollIters 
#' @param scrollClick 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_webscrape_selectors <- function(h, url, className, columnName, hasHeader, scrollIters, scrollClick, ...) {

  h9_add_step(
    h,
    "webselector",
    list(
      ...
    )
  )

}

