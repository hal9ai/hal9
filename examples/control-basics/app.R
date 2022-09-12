library(hal9)

h9_number(
  "numberinput",
  on_update = function(value) {
    h9_set(value, "number")
  }
)

h9_dropdown(
  "dropdown",
  on_update = function(value) {
    h9_set(value, "dropdown")
  }
)

h9_textbox(
  "textbox",
  on_update = function(value) {
    h9_set(value, "textbox")
  }
)

h9_textarea(
  "textarea",
  on_update = function(value) {
    h9_set(value, "textarea")
  }
)

h9_slider(
  "slider",
  on_update = function(value) {
    h9_set(value, "slider")
  }
)

h9_rawhtml(
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
