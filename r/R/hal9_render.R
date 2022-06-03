#' Render hal9 app to HTML file using RMarkdown
#'
#' @param hal9_expr R A hal9 htmlWidget
#'
#' @return
#' @export
#'
#' @examples
hal9_render <- function(hal9_expr){

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
    output_file = "D:/hal9ai/r/my_hal9.html"
  )

}
