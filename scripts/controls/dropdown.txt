<script src="https://cdn.jsdelivr.net/npm/vue@2"></script>
<link rel="stylesheet" href="https://unpkg.com/buefy/dist/buefy.min.css">
<script src="https://unpkg.com/buefy/dist/buefy.min.js"></script>

<div class="numberBoxContainer">
  <template>
    <section>
            <b-select placeholder="" @change.native="selectChange" id='dropID'>
            </b-select>
    </section>
  </template>
</div>


<script>
/**
  input: []
  params:
    - name: values
      label: Values
      value:
        - control: textbox
          value: A,B,C
  output: [ dropdownVal, html ]
**/

  var state = hal9.getState();
  state = state ? state : {};
  let dropdownVal = 0;
  if (state.dropdownVal) {
    dropdownVal = state.dropdownVal;
    value = dropdownVal;
  }

  const valuesarr = values.split(',')
  var app = new Vue({
    el: html.getElementsByClassName('numberBoxContainer')[0],
    data: {
      value: '',
    },
    methods: {
      selectChange(e){
        state.dropdownVal = e.target.value;
        hal9.setState(state);
        hal9.invalidate();
      }
    }
  })
  const dropdownElement = document.getElementById('dropID')
  for (let value of valuesarr){
    let opt = document.createElement('option');
    opt.value = opt.innerText = value.trim();
    dropdownElement.appendChild(opt);
}
html.style.height = 'auto';
</script>