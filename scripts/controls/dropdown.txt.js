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

const select = document.createElement('select');
select.style.minWidth = '50px';

const valuesarr = values instanceof String ? values.split(',') : values;
for (let value of valuesarr){
    let opt = document.createElement('option');
    opt.value = opt.innerText = value.trim();
    select.appendChild(opt);
}

let dropdown = 0;
let state = hal9.getState();
state = state ? state : {};

if (state.dropdown) {
  dropdown = state.dropdown;
  select.value = dropdown;
}

select.onchange = function() {
  state.dropdown = this.value;
  hal9.setState(state);
  hal9.invalidate();
}

html.appendChild(select);
html.style.height = '30px';
