parse_value <- function(value, id) {
  if (is.null(value)) {
    list()
  } else {
    values_list <- list()
    for (i in 1:length(value)) {
      l <- list(
        list(
          id = id - 1,
          control = value[[i]]$control,
          value = value[[i]]$value,
          values = value[[i]]$values
        )
      )
      values_list <- append(values_list, l)
    }
    values_list
  }
}

parse_txt_js <- function(file) {
  lines <- readLines(file,  warn = FALSE)
  if (lines[1] == "/**") {
    last_line <- which(lines == "**/")
    lines <- lines[2:(last_line - 1)]
    yaml <- lines |>
      paste(collapse = "\n")
    yaml::read_yaml(text = yaml)
  } else {
    list()
  }
}

build_param_list <- function(x) {
  if (is.null(x)) {
    return(NULL)
  } else {
    param_list <- list()
    for (i in 1:length(x)) {
      l <- list(ph = list(
        id = i - 1,
        static = x[[i]]$static,
        value = parse_value(x[[i]]$value, i),
        name = x[[i]]$name,
        label = x[[i]]$label,
        single = x[[i]]$single
      ))
      names(l) <- x[[i]]$name
      param_list <- append(param_list, l)
    }
    param_list
  }
}
