
a <- callr::r_bg(
  function() {
    library(plumber)
    pb <- plumb("./inst/demo-server-spec.R")
    pr_run(pb, port = 6806)
  }
)
if (rstudioapi::hasFun("viewer")) {
  rstudioapi::callFun("viewer", "http://localhost:6806")
} else {
  browseURL("http://localhost:6806")
}

a$kill()
