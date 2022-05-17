/**
  input: []
  output: [ range, html ]
  interactive: true
**/

var range = 0;

var state = hal9.getState();
state = state ? state : {};

if (state.range) {
  range = state.range;
}

if (html.innerHTML == '') {
  const input = document.createElement('input');
  input.type = 'range';
  
  if (state.range) {
    input.value = range;
  }

  input.oninput = function() {
    state.range = this.value;
    hal9.setState(state);
    hal9.invalidate();
  }

  html.appendChild(input);
}

html.style.height = '30px';
