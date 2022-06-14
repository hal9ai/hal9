/**
  input: []
  output: [ textbox, html ]
  interactive: true
**/

var textbox = 1;

var state = hal9.getState();
state = state ? state : {};


const textboxInput = document.createElement('input');
textboxInput.type = 'number';

if (state.textbox) {
    textbox = state.textbox;
    textboxInput.value = textbox;
}

textboxInput.onchange = function () {
    state.textbox = this.value;
    hal9.setState(state);
    hal9.invalidate();
}
html.appendChild(textboxInput);


html.style.height = '40px';
