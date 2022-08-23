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
  paste0(readLines(file.path(app_path, "app.json")), collapse = "\n")
}

#* @post /pipeline
#* @serializer text
function(req) {
  writeLines(req$postBody, file.path(app_path, "app.json"))
  "{}"
}

#* @post /eval
#* @param manifest:object
function(manifest) {
  hal9:::process_request(manifest)
}
