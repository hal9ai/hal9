#' Render hal9 app to HTML file using RMarkdown
#'
#' @param hal9_expr R A hal9 htmlWidget
#' @param file (optional) Name of output file
#'
#' @return
#' @export
#'
#' @examples
hal9_render <- function(hal9_expr, file = "hal9_app.html"){

  script_file <- system.file(
    "hal9_render/template.Rmd",
    package = "hal9")

  temp_file <- tempfile(fileext = ".Rmd")

  file.copy(script_file, temp_file)

  lines_to_write <- hal9_expr |>
    substitute() |>
    deparse() |>
    as.character()

  write(
    paste0("```{r, echo = FALSE}\n",
    lines_to_write,
    "\n```"),
    temp_file,
    append = TRUE
  )

  rmarkdown::render(
    temp_file,
    output_file = paste0(getwd(), "/", file)
  )

}
