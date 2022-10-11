/**
  params:
    - name: rawhtml
      type: string
      description: An HTML string with arbitrary HTML to render.
      label: html
  output: [ html ]
  layout:
    - width: 200px
      height: 200px
  state: session
**/

html.innerHTML = rawhtml;
