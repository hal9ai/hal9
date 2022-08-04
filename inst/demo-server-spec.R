source("./demo-user-script.R")

#* @get /
#* @serializer html
function() {
  bussin:::client_html(mode = "run")
}

#* @get /design
#* @serializer html
function() {
  bussin:::client_html(mode = "design")
}

#* @get /pipeline
#* @serializer text
function() {
  paste0(readLines(file.path(getwd(), "pipeline.json")), collapse = "\n")
}

#* @post /eval
#* @param manifest:object
function(manifest) {
   bussin:::process_request(manifest)
}
