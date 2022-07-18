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
bs_dropdown <- function(uid, values, on_update = NULL) {
    values <- maybe_convert_to_fn(values)
    # default_value <- values()[[1]]
    on_update <- maybe_convert_to_fn(on_update)
    node <- Node$new(uid, "dropdown", values, list(on_update = on_update))
    # node$evaluate("on_update", default_value)
    invisible(NULL)
}

#' @export 
bs_code <- function(uid, code) {
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
bs_set <- function(value, name) {
    cat(glue::glue("setting `{name}` to `{value}`"), "\n")
    .globals_data[[name]] <- value
    invisible(value)
}

#' @export
bs_get <- function(name) {
    .globals_data[[name]]
}

# returns a node obj
get_node <- function(uid) {
    .globals_nodes[[uid]]
}

process_request <- function(req) {
    uids <- names(req)

    cat(glue::glue("the nodes to be processed are {paste0(uids, collapse = ', ')}"), "\n")

    lapply(uids, function(uid) {
        cat(glue::glue("now in uid {uid}"), "\n")
        node <- get_node(uid)
        cat("get node ", uid, " successful", "\n")
        fn_args <- req[[uid]]
        # cat(glue::glue("fn_args for {uid} is {unlist(fn_args)}"), "\n")
        cat("fn_args is of length ", length(fn_args), "\n")

        if (!length(fn_args)) {
            fn <- list("main")
            .args <- NULL
            cat(glue::glue("fn is main and args is null"), "\n")
        } else {
            fn <- names(fn_args)
            .args <- unname(fn_args)
            cat(glue::glue("fn is {fn}"), "\n")
        }

        cat(glue::glue("running node {uid} function {fn} with args {paste0(.args, collapse = '')}"), "\n")

        list(
            result = do.call(node$evaluate, c(fn = fn, .args)),
            type = node$type
        )
    }) |>
        setNames(uids)
}