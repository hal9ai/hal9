/**
  input: []
  output: [ textbox, html ]
**/

var textbox = '';

const textboxEl = document.createElement('input');
textboxEl.style.width = '100%';

let state = hal9.getState();
state = state ? state : {};

if (state.textbox) {
  textbox = state.textbox;
  textboxEl.value = textbox;
}

textboxEl.onchange = function () {
  state.textbox = this.value;
  hal9.setState(state);
  hal9.invalidate();
}

html.appendChild(textboxEl);
