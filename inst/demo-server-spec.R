source("./demo-user-script.R")

#* @post /eval:object
function(manifest) {
   bussin:::process_request(manifest)
}
