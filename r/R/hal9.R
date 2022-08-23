.globals_nodes <- new.env()
.globals_data <- new.env()

Node <- R6::R6Class("Node", list(
    uid = NULL,
    values = NULL,
    events = NULL,
    initialize = function(uid, values, events = NULL) {
        self$uid <- uid
        self$values <- values
        self$events <- events
        register_node(self, self$uid)
        self
    },
    evaluate = function(fn = NULL, ...) {
        type <- "values"
        if (!is.null(fn)) {
            type <- "events"
            result <- list(self[[type]][[fn]](...))
        }
        else {
            result <- lapply(names(self[[type]]), function(name) self[[type]][[name]]())
        }

        names(result) <- names(self[[type]])
        result
    }
))

register_node <- function(obj, uid) {
    .globals_nodes[[uid]] <- obj
}

#' @export
h9_node <- function(uid, ...) {
    args <- lapply(list(...), maybe_convert_to_fn)

    values <- list()
    events <- list()
    for (name in names(args)) {
        if (startsWith(name, "on_")) {
            events[[name]] <- args[[name]]
        } else {
            values[[name]] <- args[[name]]
        }
    }

    Node$new(uid, values, events)
    invisible(NULL)
}

maybe_convert_to_fn <- function(x) {
    if (is.function(x)) {
        x
    } else {
        (\() x)
    }
}

#' @export
h9_set <- function(value, name) {
    .globals_data[[name]] <- value
    invisible(value)
}

#' @export
h9_get <- function(name) {
    .globals_data[[name]]
}

# returns a node obj
get_node <- function(uid) {
    .globals_nodes[[uid]]
}

process_request <- function(req) {
    uids <- names(req)

    lapply(uids, function(uid) {
        node <- get_node(uid)
        fn_args <- req[[uid]]
        fn <- names(fn_args)

        if (!length(fn_args)) {
            results <- node$evaluate("values", fn = NULL, list())
            list(
              result = results
            )
        } else {
            .args <- unname(fn_args)
            do.call(node$evaluate, c(fn = fn, .args))

            list()
        }
    }) |>
        setNames(uids)
}

client_html <- function(...) {
    options <- list(...)

    html <- paste(readLines(system.file("client.html", package = "hal9")), collapse = "\n")

    html <- gsub("__options__", gsub("'", "\\'", jsonlite::toJSON(options, auto_unbox = TRUE)), html)

    html
}

h9_reset <- function() {
  rm(list = ls(envir = .globals_nodes), envir = .globals_nodes)
  rm(list = ls(envir = .globals_data), envir = .globals_data)
}

#' @export
h9_start <- function(app = "app.R", port = 6806) {
    h9_reset()

    if (!file.exists(app)) writeLines("", app)

    user_code <- readLines(app)
    server_code <- readLines(system.file("server-spec.R", package = "hal9"))

    api_file <- tempfile()
    writeLines(c(
        "## User Code",
        user_code,
        "",
        "## Hal9 Code",
        paste0("app_file <- \"", normalizePath(app), "\""),
        paste0("app_path <- \"", dirname(normalizePath(app)), "\""),
        "",
        server_code
    ), api_file)

    pb <- plumber::plumb(api_file)
    plumber::pr_run(pb, port = port)
}
