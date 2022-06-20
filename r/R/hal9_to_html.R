#' Render hal9 app to HTML file using RMarkdown
#'
#' @param hal9_expr R A hal9 htmlWidget
#' @param file (optional) Name of output file
#'
#' @export
#'
hal9_to_html <- function(hal9_expr, file = "hal9_app.html",
                        title = "My hal9 app",
                        desc = NULL, wd = getwd()) {

  if (is.null(desc)) {
    desc <- "Learn more about Hal9 at our website: [https://hal9.com/](https://hal9.com/)"
  }

  script_file <- system.file(
    "hal9_render/template.Rmd",
    package = "hal9"
  )

  temp_file <- tempfile(fileext = ".Rmd")

  file.copy(script_file, temp_file)

  hal9_expr_chr <- hal9_expr |>
    substitute() |>
    deparse() |>
    as.character() |>
    paste(collapse = "\n")

  lines <- readLines(temp_file)
  lines <- gsub("\\{\\{title\\}\\}", title, lines)
  lines <- gsub("\\{\\{desc\\}\\}", desc, lines)
  lines <- gsub("\\{\\{hal9_expr\\}\\}", hal9_expr_chr, lines)

  writeLines(lines, temp_file)

  rmarkdown::render(
    temp_file,
    output_file = paste0(wd, "/", file)
  )

}
