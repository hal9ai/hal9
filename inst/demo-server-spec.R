source("./demo-user-script.R")

#* @get /
#* @serializer html
function() {
  bussin:::designer_html()
}

#* @post /eval:object
function(manifest) {
   bussin:::process_request(manifest)
}
