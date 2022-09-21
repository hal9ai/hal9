
test_that("multiplication works", {
  h9_new("test-app")
  succeed()

  unlink("test-app", recursive = TRUE)
})
