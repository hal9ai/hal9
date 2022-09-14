library(hal9)

iris |> h9_set("df")

h9_dropdown(
  "dropdown",
  values = function() {
    "setosa,versicolor"
  },
  on_update = function(value) {
    h9_set(value, "selected_species")
  }
)

h9_rawhtml(
  "rawhtml",
  rawhtml = function() {
    df <- h9_get("df")
    selected_species <- h9_get("selected_species")
    df <- df[df$Species == selected_species, ]

    knitr::kable(df, format = "html") |>
      as.character()
  }
)

h9_rawhtml(
  "filtername",
  rawhtml = function() {
    paste("Filtering by", h9_get("selected_species"))
  }
)

h9_dropdown(
  "something",
  values = function() {
    "Something A, Something B"
  },
  on_update = function(value) {
    h9_set(value, "something_selected")
  }
)

h9_rawhtml("someresult", rawhtml = function() {
  paste("Seleted: ", h9_get("something_selected"))
})



