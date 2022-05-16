/**
  input: []
  params:
    - name: values
      label: Values
      value:
        - control: textbox
          value: A,B,C
  output: [ dropdown, html ]
**/

const input = document.createElement('select');
input.style.width = '100px';

input.innerHTML = '';
const valuesarr = values.split(',');
for (let value of valuesarr){
    let opt = document.createElement('option');
    opt.value = opt.innerText = value;
    input.appendChild(opt);
}

let dropdown = 0;
let state = hal9.getState();
state = state ? state : {};

if (state.dropdown) {
  dropdown = state.dropdown;
}

input.onchange = function() {
  state.dropdown = this.value;
  hal9.setState(state);
  hal9.invalidate();
}

html.appendChild(input);
html.style.height = '30px';
