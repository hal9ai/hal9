/**
  input: []
  output: [ range, html ]
**/

const input = document.createElement('input');
input.type = 'range';
var range = 0;

var state = hal9.getState();
state = state ? state : {};

if (state.range) {
  range = state.range;
  input.value = range;
}

input.onchange = function() {
  state.range = this.value;
  hal9.setState(state);
  hal9.invalidate();
}

html.appendChild(input);
html.style.height = '30px';
