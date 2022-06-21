parse_value <- function(value){

  if(is.null(value)){
    list(
      list(
        id = 0,
        name = "",
        label = ""
      )
    )
  } else {

    value |>
      purrr::imap(
        function(x, y){
          c(x, list(id = y))
        }
      )
  }
}

parse_txt_js <- function(file) {
  lines <- readLines(file,  warn = FALSE)
  last_line <- which(lines == "**/")
  lines <- lines[2:(last_line - 1)]
  yaml <- lines |>
    paste(collapse = "\n")
  yaml::read_yaml(text = yaml)
}

build_param_list <- function(x){
  x$params$params |>
    purrr::imap(~list(
      id = .y-1,
      static = FALSE,
      value = parse_value(.x$value),
      name = .x$name,
      label = .x$label,
      single = .x$single
    )) |>
    purrr::set_names(
      x$params$params |> purrr::map_chr(purrr::pluck, "name")
    )
}
