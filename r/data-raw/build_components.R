devtools::load_all()

components_file <- "../scripts/components.json"

components <- jsonlite::read_json(components_file) |>
  unlist(recursive = FALSE, use.names = FALSE)

for (i in 1:length(components)) {
  script <- paste0("../scripts/", components[[i]]$source)
  if (nchar(components[[i]][["function"]]) > 0) {
    message("Processing ", components[[i]]$name)

    list <- script |>
      parse_txt_js()
    components[[i]]$params <- list$params
    components[[i]]$deps <- list$deps
  }
}

usethis::use_data(components, internal = TRUE, overwrite = TRUE)
