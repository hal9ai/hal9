/**
  output: [ html ]
  params:
    - name: field
      label: Field
    - name: separator
      label: Separator
      value:
        - control: textbox
          value: ', '
  deps: [
    'https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js',
  ]
**/

data = await hal9.utils.toRows(data);

text = ''
if (field) {
  text = data.map(e => e[field]).join(separator)
}
else {
  text = data.map(e => {
    return Object.values(e).join(' ')
  }).join(separator)
}

html.innerText = text;
html.style.whiteSpace = 'normal';
html.style.overflowY = 'auto';
html.style.maxWidth = '100%';
html.style.wordBreak = 'break-all';
