library(bussin)

data.frame(
    state = c("CA", "WA", "OR"),
    statistic = c(69, 420, 666)
) |>
    bs_set("df")

bs_dropdown(
    "dropdown",
    values = c("CA", "WA", "OR"),
    on_update = function(value) {
        bs_set(value, "selected_state")
    }
)

bs_code(
    "stat_table",
    {
        df <- bs_get("df")
        selected_state <- bs_get("selected_state")
        df <- df[df$state == selected_state, ]

        knitr::kable(df, format = "html") |>
            as.character()
    }
)
