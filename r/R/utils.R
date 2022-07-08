#' Coordinates from City
#'
#' Create latitude and longitude columns from a pair of US city and state columns
#'
#' @param h A h9 object created by h9_create.
#' @param city 
#' @param state 
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_city_to_map <- function(h, city  = NULL, state  = NULL, ...) {
  matched_call <- as.list(match.call())

  h9_add_step(
    h,
    "citytomap",
    update = list(
      city = city,
      state = state,
      ...
    ),
    matched_call = matched_call
  )

}

#' Coordinates from Zip Code
#'
#' Create latitude and longitude columns from a US zip code column
#'
#' @param h A h9 object created by h9_create.
#' @param zipcode 
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_zip_to_map <- function(h, zipcode  = NULL, ...) {
  matched_call <- as.list(match.call())

  h9_add_step(
    h,
    "ziptomap",
    update = list(
      zipcode = zipcode,
      ...
    ),
    matched_call = matched_call
  )

}

#' Upscale
#'
#' Magnify an image with AI enhancement
#'
#' @param h A h9 object created by h9_create.
#' @param originalImg 
#' @param model 
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_upscaler <- function(h, originalImg  = NULL, model  = NULL, ...) {
  matched_call <- as.list(match.call())

  h9_add_step(
    h,
    "upscaler",
    update = list(
      originalImg = originalImg,
      model = model,
      ...
    ),
    matched_call = matched_call
  )

}

#' Stop
#'
#' Stops pipeline execution conditionally
#'
#' @param h A h9 object created by h9_create.
#' @param expression A JavaScript expression, which may use the 'outputs' dictionary which references outputs produced by previous steps by name.
#' @param ... Other h9 parameters.
#'
#' @return A list with the pipeline specification.
#' @export
#'
h9_stop <- function(h, expression  = NULL, ...) {
  matched_call <- as.list(match.call())

  h9_add_step(
    h,
    "stop",
    update = list(
      expression = expression,
      ...
    ),
    matched_call = matched_call
  )

}

