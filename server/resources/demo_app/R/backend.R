library(hal9)

iris |> h9_set("df")

h9_dropdown(
    "species_dropdown",
    values = unique(levels(iris$Species)),
    on_update = function(value) {
        h9_set(value, "selected_species")
    }
)

h9_html(
    "iris_table",
    rawhtml = function() {
        sp <- h9_get("selected_species")
        if (is.null(sp)) {
            return("")
        }

        out <- iris[iris$Species == sp, ]

        num_rows <- h9_get("num_rows")

        if (!is.null(num_rows)) {
            out <- out |> head(num_rows)
        }

        out |>
            knitr::kable(format = "html") |>
            as.character()
    }
)

h9_slider("slider_rows",
    value = 1,
    min = 1,
    max = 10,
    step = 1,
    on_update = function(value) {
        h9_set(value, "num_rows")
    }
)
