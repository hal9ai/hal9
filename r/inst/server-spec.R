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
#* @serializer json list(auto_unbox=TRUE)
function(req) {
  parsed <- jsonlite::fromJSON(req$postBody, simplifyDataFrame = FALSE)
  hal9:::process_request(parsed)
}
