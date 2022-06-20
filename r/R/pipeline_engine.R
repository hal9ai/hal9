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

parse_txt_js <- function(file = "../scripts/transforms/filter.txt.js"){

  temp <- tempfile()

  aux <- readLines(file)

  indices <- which(aux == "**/" | aux == "/**")

  cat(
    paste0(
      aux[(indices[1]+1):(indices[2]-1)],
      collapse = "\n"),
    file = temp
  )

  con <- file(temp, "r")

  response <- list(
    params = yaml::read_yaml(temp),
    script = paste0(aux[indices[2]:length(aux)], collapse = "\n")
  )

  close(con)

  return(response)
}

build_param_list <- function(parsed_txt_js){

  parsed_txt_js$params$params |>
    purrr::imap(~list(
      id = .y-1,
      static = FALSE,
      value = parse_value(.x$value),
      name = .x$name,
      label = .x$label,
      single = .x$single
    )) |>
    purrr::set_names(
      parsed_txt_js$params$params |> purrr::map_chr(purrr::pluck, "name")
    )
}
