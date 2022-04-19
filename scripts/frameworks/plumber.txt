##
## input: [ data ]
## output: [ data ]
## params:
##   - name: sometext
##     label: Some Text
##     value:
##       - control: textbox
##         value: 'test'
## environment: worker
## cache: true
##

#* Echo back the input
#* @param data The input data
#* @post /
function(data) {
  list(data = paste0("With sometext as '", sometext, "' and ", nrow(data), " records."))
}
