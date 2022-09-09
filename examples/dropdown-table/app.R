library(hal9)

iris |> h9_set("df")

h9_node(
  "dropdown",
  # values = c("setosa", "versicolor"),
  on_update = function(value) {
    h9_set(value, "selected_species")
  }
)

h9_node(
  "rawhtml",
  rawhtml = function() {
    df <- h9_get("df")
    selected_species <- h9_get("selected_species")
    df <- df[df$Species == selected_species, ]

    knitr::kable(df, format = "html") |>
      as.character()
  }
)

