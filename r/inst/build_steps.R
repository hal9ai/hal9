pkgload::load_all()

files_to_build <- c(
  "../scripts/transforms/filter.txt.js"
)

pipeline_names <- files_to_build |>
  basename() |>
  fs::path_ext_remove() |>
  fs::path_ext_remove()

pipeline_data <- purrr::map(files_to_build,
  ~parse_txt_js(.x) |>
  build_param_list()) |>
  purrr::set_names(pipeline_names)

usethis::use_data(pipeline_data)
