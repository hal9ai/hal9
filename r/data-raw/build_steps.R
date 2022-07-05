devtools::load_all()

sources <- lapply(components, function(x) x$source)
rfiles <- unique(sub("/.*", ".R", sources))

res <- file.create(paste0("R/", rfiles), showWarnings = FALSE)

if (!all(res)) {
  stop(paste(
    "The following R files were not created:",
    paste(rfiles[res], collapse = ", ")
  ))
}

for(i in 1:length(components)) {

  if (!is.null(components[[i]]$params)) {
    print(paste0(i, ": creating component ", components[[i]]$name))

    func_params <- lapply(components[[i]]$params, function(x) x$name) |>
      unlist() |>
      paste(" = NULL") |>
      paste(collapse = ", ")

    params <- list()
    list_func_params <- list()

    for (j in 1:length(components[[i]]$params)) {

      plist <- list(
        param_name = components[[i]]$params[[j]]$name,
        param_desc = components[[i]]$params[[j]]$description
      )

      plist <- lapply(plist, function(x) ifelse(is.null(x), "", x))

      template_roxygen <- readLines("data-raw/templates/roxygen_param.txt")
      template_list <- readLines("data-raw/templates/list_params.txt")

      template_list <- gsub(
        "\\{\\{param_name\\}\\}",
        replacement = plist$param_name,
        template_list
      )

      for (k in 1:length(plist)) {
        template_roxygen <- sub(
          paste0("\\{\\{", names(plist[k]), "\\}\\}"),
          plist[[k]],
          template_roxygen
        )
      }

      params <- c(
        params,
        template_roxygen
      )

      list_func_params <- c(
        list_func_params,
        template_list
      )

    }

    params <- params |>
      unlist() |>
      paste(collapse = "\n")

    list_func_params <- list_func_params |>
      unlist() |>
      paste(collapse = "\n")

    funlist <- list(
      func_title = components[[i]]$label,
      func_description = components[[i]]$description,
      params = params,
      func_name = paste0("h9_", components[[i]]$`function`),
      func_params = func_params,
      step_name = components[[i]]$name,
      list_func_params = list_func_params
    )

    template <- readLines("data-raw/templates/step_function.txt")

    for (k in 1:length(funlist)) {
      template <- sub(
        paste0("\\{\\{", names(funlist[k]), "\\}\\}"),
        funlist[[k]],
        template
      )
    }

    rfile <- unique(sub("/.*", ".R", components[[i]]$source))

    template |>
      paste(collapse = "\n") |>
      write(
        file = paste0("R/", rfile),
        append = TRUE
      )
  }

}
