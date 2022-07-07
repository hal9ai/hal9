<script src="https://cdn.jsdelivr.net/npm/vue@2"></script>
<link rel="stylesheet" href="https://unpkg.com/buefy/dist/buefy.min.css">
<script src="https://unpkg.com/buefy/dist/buefy.min.js"></script>



<div class="rangeContainer">
  <template>
    <section>
      <div style= "height:30px"></div>
        <b-field>
            <b-slider tooltip-always :min="parameter" :max="maxparam" :step="steparam" ></b-slider>
        </b-field>
    </section>
  </template>
</div>


<script>
/**
  input: []
  params:
    - name: min
      label: Min Range Value
      value:
        - control: number
          value: 1
    - name: max
      label: Max Range Value
      value:
        - control: number
          value: 10
    - name: step
      label: Step Range Value
      value:
        - control: number
          value: 1
  output: [  html,rangeVal ]
**/

  var state = hal9.getState();
  state = state ? state : {};
  let rangeVal = 0;
  if (state.rangeVal) {
    rangeVal = state.rangeVal;
    value = rangeVal;
  }

  var app = new Vue({
    el: html.getElementsByClassName('rangeContainer')[0],
    data: {
      value: rangeVal,
      parameter: parseFloat(min),
      maxparam: parseFloat(max),
      steparam: parseFloat(step)
    }
  })
  //width of the control 
  document.getElementsByClassName('b-slider-track')[0].style = "width: 300px"
  document.getElementsByClassName('b-slider-track')[0].style.left = "3%"

let rangeNumber = document.getElementsByClassName('tooltip-content')[0]
console.log('first html ',html)

rangeNumber.addEventListener("DOMCharacterDataModified", function (event) { 
  state.rangeVal = event.newValue;
  hal9.setState(state);
  hal9.invalidate();
  }, false);

let minMaxStep = document.getElementsByClassName('b-slider-thumb')[0]
minMaxStep.setAttribute('aria-valuemin', 3);
console.log(minMaxStep)
</script>