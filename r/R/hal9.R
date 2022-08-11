.globals_nodes <- new.env()
.globals_data <- new.env()

Node <- R6::R6Class("Node", list(
    uid = NULL,
    type = NULL,
    main = NULL,
    aux = NULL,
    initialize = function(uid, type, main, aux = NULL) {
        self$uid <- uid
        self$type <- type
        self$main <- main
        self$aux <- aux
        register_node(self, self$uid)
        self
    },
    evaluate = function(fn = NULL, ...) {
        fn <- if (is.null(fn) || fn == "main") {
            self$main
        } else {
            self$aux[[fn]]
        }
        fn(...)
    }
))

register_node <- function(obj, uid) {
    .globals_nodes[[uid]] <- obj
}

#' @export
h9_dropdown <- function(uid, values, on_update = NULL) {
    values <- maybe_convert_to_fn(values)
    on_update <- maybe_convert_to_fn(on_update)
    Node$new(uid, "dropdown", values, list(on_update = on_update))
    invisible(NULL)
}

#' @export
h9_textbox <- function(uid, default, on_update = NULL) {
    default <- maybe_convert_to_fn(default)
    on_update <- maybe_convert_to_fn(on_update)
    Node$new(uid, "textbox", default, list(on_update = on_update))
}
#' @export
h9_select <- function(uid, values, on_update = NULL) {
    values <- maybe_convert_to_fn(values)
    on_update <- maybe_convert_to_fn(on_update)
    Node$new(uid, "dropdown", values, list(on_update = on_update))
    invisible(NULL)
}


#' @export
h9_code <- function(uid, code) {
    code <- substitute(code)
    fn_run_code <- function() eval(code)
    Node$new(uid, "R_code", fn_run_code)
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

        if (!length(fn_args)) {
            fn <- list("main")
            .args <- NULL
        } else {
            fn <- names(fn_args)
            .args <- unname(fn_args)
        }

        list(
            result = do.call(node$evaluate, c(fn = fn, .args)),
            type = node$type
        )
    }) |>
        setNames(uids)
}

client_html <- function(...) {
    options <- list(...)

    html <- paste(readLines(system.file("client.html", package = "hal9")), collapse = "\n")

    html <- gsub("__options__", gsub("'", "\\'", jsonlite::toJSON(options, auto_unbox = TRUE)), html)

    html
}

h9_start_api_server <- function(script_dir, port) {
    source(script_dir)
    plumber::pr() |>
        plumber::pr_post("/eval", function(manifest) hal9:::process_request(manifest)) |>
        plumber::pr_run(port = port)
}
