/**
  input: [ rawhtml ]
  output: [ html ]
  layout:
    - width: 200px
      height: 200px
  state: session
**/

html.innerHTML = rawhtml;
