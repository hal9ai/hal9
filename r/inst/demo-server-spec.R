source("./demo-user-script.R")

#* @get /
#* @serializer html
function() {
  hal9:::client_html(mode = "run")
}

#* @get /design
#* @serializer html
function() {
  hal9:::client_html(mode = "design")
}

#* @get /pipeline
#* @serializer text
function() {
  paste0(readLines(file.path(getwd(), "pipeline.json")), collapse = "\n")
}

#* @post /pipeline
#* @serializer text
function(req) {
  writeLines(req$postBody, file.path(getwd(), "pipeline.json"))
  "{}"
}

#* @post /eval
#* @param manifest:object
function(manifest) {
  hal9:::process_request(manifest)
}
