/**
  input: []
  output: [ number, html ]
  interactive: true
**/

var number = 1;

var state = hal9.getState();
state = state ? state : {};

if (state.number) {
  number = state.number;
}

if (html.innerHTML == '') {
  const textboxInput = document.createElement('input');
  textboxInput.type = 'number';

  if (state.number) {
    textboxInput.value = number;
  }

  textboxInput.onchange = function () {
    state.number = this.value;
    hal9.setState(state);
    hal9.invalidate();
  }
  html.appendChild(textboxInput);
}

html.style.height = '40px';
