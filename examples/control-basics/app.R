library(hal9)

iris |> h9_set("df")

h9_node(
  "numberinput",
  on_update = function(value) {
    h9_set(value, "number")
  }
)

h9_node(
  "dropdown",
  on_update = function(value) {
    h9_set(value, "dropdown")
  }
)

h9_node(
  "textbox",
  on_update = function(value) {
    h9_set(value, "textbox")
  }
)

h9_node(
  "textarea",
  on_update = function(value) {
    h9_set(value, "textarea")
  }
)

h9_node(
  "slider",
  on_update = function(value) {
    h9_set(value, "slider")
  }
)

h9_node(
  "rawhtml",
  rawhtml = function() {
    paste0(
      "Number (", h9_get("number"), ") <br>",
      "Drodown (", h9_get("dropdown"), ") <br>",
      "Textbox (", h9_get("textbox"), ") <br>",
      "Textarea (", h9_get("textarea"), ") <br>",
      "Slider (", h9_get("slider"), ") <br>"
    )
  }
)
