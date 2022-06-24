test_that("Transformation steps", {
  expect_visible(h9_add_step(h9_create(mtcars), "assign"))
  expect_visible(h9_add_step(h9_create(mtcars), "convert"))
  expect_visible(h9_add_step(h9_create(mtcars), "derive"))
  expect_visible(h9_add_step(h9_create(mtcars), "drop"))
  expect_visible(h9_add_step(h9_create(mtcars), "filter"))
  expect_visible(h9_add_step(h9_create(mtcars), "fold"))
  expect_visible(h9_add_step(h9_create(mtcars), "pivot"))
  expect_visible(h9_add_step(h9_create(mtcars), "rollingsum"))
  expect_visible(h9_add_step(h9_create(mtcars), "sample"))
  expect_visible(h9_add_step(h9_create(mtcars), "select"))
  expect_visible(h9_add_step(h9_create(mtcars), "sort"))
  expect_visible(h9_add_step(h9_create(mtcars), "summarize"))
})

test_that("Scatter chart", {
  expect_visible(h9_add_step(h9_create(mtcars), "scatterchart"))
})

test_that("Bar chart", {
  expect_visible(h9_add_step(h9_create(mtcars), "barchart"))
})

test_that("Line chart", {
  expect_visible(h9_add_step(h9_create(mtcars), "linechart"))
})

test_that("Sankey chart", {
  expect_visible(h9_add_step(h9_create(mtcars), "sankeychart"))
})

test_that("Histogram chart", {
  expect_visible(h9_add_step(h9_create(mtcars), "histogramchart"))
})

test_that("Heatmap chart", {
  expect_visible(h9_add_step(h9_create(mtcars), "heatmapchart"))
})

test_that("Dot plot chart", {
  expect_visible(h9_add_step(h9_create(mtcars), "dotplotchart"))
})

test_that("Error bar chart", {
  expect_visible(h9_add_step(h9_create(mtcars), "errorbarchart"))
})
