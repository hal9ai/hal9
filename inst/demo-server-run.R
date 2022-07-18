library(plumber)
pb <- plumb("./inst/demo-server-spec.R")
pr_run(pb, port = 6806)
