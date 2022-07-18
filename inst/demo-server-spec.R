source("./demo-user-script.R")

#* @post /eval
function(manifest) {
   bussin:::process_request(manifest)
}