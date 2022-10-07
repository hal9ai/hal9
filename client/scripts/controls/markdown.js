/**
  input: []
  params:
    - name: markdown
      label: Markdown
      value:
        - control: textbox
          value: Hello **World**
  output: [ html ]
  deps:
    - https://cdnjs.cloudflare.com/ajax/libs/showdown/2.0.0/showdown.min.js
**/

const converter = new showdown.Converter();
html.innerHTML = converter.makeHtml(markdown);
