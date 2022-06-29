build_value_list <- function(x){

  lapply(x, function(x){
    list(
      id = "0",
      name = x,
      label = x
    )
  })

}
