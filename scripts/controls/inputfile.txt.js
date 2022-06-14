/**
  input: []
  output: [ inputfile, html ]
  interactive: true
**/

var inputfile = '';

var state = hal9.getState();
state = state ? state : {};
html.style.height = '40px';

const input = document.createElement('input');
input.type = 'file';
const urldata = document.createElement('input');



if (state.inputfile) {
    inputfile = state.inputfile;
    urldata.value = inputfile;
}

input.onchange = function (e) {
    const reader = new FileReader()
    reader.onload = async (e) => {
        const text = (e.target.result);
        state.inputfile = text
        hal9.setState(state);
        hal9.invalidate();
    };
    reader.readAsDataURL(e.target.files[0])
}
html.appendChild(input);


