#' Coordinates from City
#'
#' Create latitude and longitude columns from a pair of US city and state columns
#'
#' @param city 
#' @param state 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_city_to_map <- function(h, city, state, ...) {

  h9_add_step(
    h,
    "citytomap",
    list(
      ...
    )
  )

}

#' Coordinates from Zip Code
#'
#' Create latitude and longitude columns from a US zip code column
#'
#' @param zipcode 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_zip_to_map <- function(h, zipcode, ...) {

  h9_add_step(
    h,
    "ziptomap",
    list(
      ...
    )
  )

}

#' Upscale
#'
#' Magnify an image with AI enhancement
#'
#' @param originalImg 
#' @param model 
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_upscaler <- function(h, originalImg, model, ...) {

  h9_add_step(
    h,
    "upscaler",
    list(
      ...
    )
  )

}

#' Stop
#'
#' Stops pipeline execution conditionally
#'
#' @param expression A JavaScript expression, which may use the 'outputs' dictionary which references outputs produced by previous steps by name.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_stop <- function(h, expression, ...) {

  h9_add_step(
    h,
    "stop",
    list(
      ...
    )
  )

}

