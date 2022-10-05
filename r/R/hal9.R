.globals_nodes <- new.env()
.globals_data <- new.env()

Node <- R6::R6Class("Node", list(
    uid = NULL,
    fns = NULL,
    initialize = function(uid, fns) {
        self$uid <- uid
        self$fns <- fns
        register_node(self, self$uid)
        self
    },
    evaluate = function(fn, ...) {
        fn <- self$fns[[fn]]

        if (is.null(fn)) {
            stop("Function not defined for node.")
        }

        result <- NULL
        if (length(...) == 0) {
            result <- fn()
        } else {
            result <- do.call(fn, ...)
        }

        h9_convert(result)
    }
))

register_node <- function(obj, uid) {
    .globals_nodes[[uid]] <- obj
}

#' @export
h9_node <- function(uid, ...) {
    fns <- lapply(list(...), maybe_convert_to_fn)

    Node$new(uid, fns)
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
    responses <- lapply(req, function(call) {
        node <- get_node(call$node)
        fn_name <- call$fn_name

        if (is.null(node)) {
            return(
                list(
                    node = call$node,
                    fn_name = fn_name,
                    result = list(Error = paste0("Node `", call$node, "` not defined in runtime."))
                )
            )
        }

        fn_args_names <- call$args |> sapply(\(x) x$name)
        fn_args_values <- call$args |> lapply(\(x) x$value)
        fn_args <- setNames(fn_args_values, fn_args_names)

        tryCatch({
            list(
                node = call$node,
                fn_name = fn_name,
                result = node$evaluate(fn_name, fn_args)
            )
        },
        error = function(e) {
            list(
                node = call$node,
                fn_name = fn_name,
                error = paste0(e, collapse = "\\n")
            )
        })
    })
    list(calls = responses)
}

client_html <- function(...) {
    options <- list(...)
    options$designer <- list(
        persist = "pipeline",
        eval = "eval",
        heartbeat = "ping"
    )

    html <- paste(readLines(system.file("client.html", package = "hal9")), collapse = "\n")

    html <- gsub("__options__", gsub("'", "\\'", jsonlite::toJSON(options, auto_unbox = TRUE)), html)

    html
}

h9_run_script <- function(app = "app.R", port = NULL) {
    tryCatch(
        {
            if (!file.exists(app)) writeLines("", app)

            user_code <- readLines(app)
            server_code <- readLines(system.file("server-spec.R", package = "hal9"))

            api_file <- tempfile()
            writeLines(c(
                "## User Code",
                user_code,
                "",
                "## Hal9 Code",
                paste0("app_file <- \"", normalizePath(app, winslash = "/"), "\""),
                paste0("app_path <- \"", dirname(normalizePath(app)), "\""),
                "",
                server_code
            ), api_file)

            pb <- plumber::plumb(api_file)
            plumber::pr_run(pb, port = port)
        },
        error = function(e) message("runtime_startup_error:", paste0(e, collapse = "\n"))
    )
}
