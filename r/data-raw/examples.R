# examples for each function

devtools::load_all()

h9_create(mtcars)

h <- mtcars |>
  h9_create()

mtcars |>
  h9_create() |>
  h9_add_step(step = "drop")

# charts -----------------------------------------------------------------

mtcars |>
  h9_create() |>
  h9_add_step(step = "barchart")

mtcars |>
  h9_create() |>
  h9_add_step(step = "boxplotchart")

mtcars |>
  h9_create() |>
  h9_add_step(step = "dotplotchart")

mtcars |>
  h9_create() |>
  h9_add_step(step = "errorbarchart")

mtcars |>
  h9_create() |>
  h9_add_step(step = "heatmapchart")

mtcars |>
  h9_create() |>
  h9_add_step(step = "histogramchart")

mtcars |>
  h9_create() |>
  h9_add_step(step = "linechart")

mtcars |>
  h9_create() |>
  h9_add_step(step = "sankeychart")

mtcars |>
  h9_create() |>
  h9_add_step(step = "scatterchart")

mtcars |>
  h9_create() |>
  h9_add_step(step = "treemapchart")

mtcars |>
  h9_create() |>
  h9_add_step(step = "violinplotchart")


# transforms --------------------------------------------------------------

mtcars |>
  h9_create() |>
  h9_add_step(step = "assign")

mtcars |>
  h9_create() |>
  h9_add_step(step = "bin")

mtcars |>
  h9_create() |>
  h9_add_step(step = "column")

mtcars |>
  h9_create() |>
  h9_add_step(step = "convert")

mtcars |>
  h9_create() |>
  h9_add_step(step = "derive")

mtcars |>
  h9_create() |>
  h9_add_step(step = "drop")

mtcars |>
  h9_create() |>
  h9_add_step(step = "explode")

mtcars |>
  h9_create() |>
  h9_add_step(step = "fetch")

mtcars |>
  h9_create() |>
  h9_add_step(step = "filter")

mtcars |>
  h9_create() |>
  h9_add_step(step = "fold")

mtcars |>
  h9_create() |>
  h9_add_step(step = "impute")

mtcars |>
  h9_create() |>
  h9_add_step(step = "join")

mtcars |>
  h9_create() |>
  h9_add_step(step = "pivot")

mtcars |>
  h9_create() |>
  h9_add_step(step = "range")

mtcars |>
  h9_create() |>
  h9_add_step(step = "rollingsum")

mtcars |>
  h9_create() |>
  h9_add_step(step = "sample")

mtcars |>
  h9_create() |>
  h9_add_step(step = "select")

mtcars |>
  h9_create() |>
  h9_add_step(step = "slice")

mtcars |>
  h9_create() |>
  h9_add_step(step = "sort")

mtcars |>
  h9_create() |>
  h9_add_step(step = "subsprev")

mtcars |>
  h9_create() |>
  h9_add_step(step = "summarize")


# visualizations ----------------------------------------------------------

mtcars |>
  h9_create() |>
  h9_add_step(step = "bubbles")

mtcars |>
  h9_create() |>
  h9_add_step(step = "facets")

mtcars |>
  h9_create() |>
  h9_add_step(step = "funnel")

mtcars |>
  h9_create() |>
  h9_add_step(step = "map")

mtcars |>
  h9_create() |>
  h9_add_step(step = "minicharts")

mtcars |>
  h9_create() |>
  h9_add_step(step = "network")

mtcars |>
  h9_create() |>
  h9_add_step(step = "plotlycharts")

mtcars |>
  h9_create() |>
  h9_add_step(step = "radialbars")

mtcars |>
  h9_create() |>
  h9_add_step(step = "scattercust")

mtcars |>
  h9_create() |>
  h9_add_step(step = "three")

mtcars |>
  h9_create() |>
  h9_add_step(step = "waffle")

mtcars |>
  h9_create() |>
  h9_add_step(step = "waterfall")

mtcars |>
  h9_create() |>
  h9_add_step(step = "wordcloud")

