devtools::load_all(".")

a <- mtcars |>
  dplyr::mutate(cyl = ifelse(cyl == 6, NA, cyl)) |>
  h9_create() |>
  h9_add_step("summarize")

a

a$x$pipeline |> jsonlite::toJSON(pretty = TRUE, auto_unbox = TRUE)


mtcars |>
  dplyr::mutate(cyl = ifelse(cyl == 6, NA, cyl)) |>
  jsonlite::toJSON(pretty = TRUE, null = "null")
