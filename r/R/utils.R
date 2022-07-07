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

  h9_add_step(
    h,
    "citytomap",
    update = list(
      city = city,
      state = state,
      ...
    )
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

  h9_add_step(
    h,
    "ziptomap",
    update = list(
      zipcode = zipcode,
      ...
    )
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

  h9_add_step(
    h,
    "upscaler",
    update = list(
      originalImg = originalImg,
      model = model,
      ...
    )
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

  h9_add_step(
    h,
    "stop",
    update = list(
      expression = expression,
      ...
    )
  )

}

