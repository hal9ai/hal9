/**
  input: [ rawhtml ]
  output: [ html ]
  layout:
    - width: 600px
      height: 450px
  state: session
**/

html.innerHTML = rawhtml;
