library(bussin)

iris |> bs_set("df")

bs_dropdown(
    "dropdown",
    values = c("setosa", "versicolor"),
    on_update = function(value) {
        bs_set(value, "selected_species")
    }
)

bs_code(
    "rawhtml",
    {
        df <- bs_get("df")
        selected_species <- bs_get("selected_species")
        df <- df[df$Species == selected_species, ]

        knitr::kable(df, format = "html") |>
            as.character()
    }
)
