source("./demo-user-script.R")

#* @get /
#* @serializer html
function() {
  bussin:::designer_html()
}

#* @post /eval
#* @param manifest:object
function(manifest) {
   bussin:::process_request(manifest)
}
