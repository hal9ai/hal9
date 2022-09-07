/**
  input: []
  output: [ html, textarea ]
  events: [ on_update ]
  layout:
    - width: 900px
**/

var textarea = '';
html.innerHTML = '';

const textareaEl = document.createElement('textarea');
textareaEl.rows = 5
textareaEl.style.width = 'calc(100% - 6px)';
textareaEl.style.resize = 'none';

var textarea = hal9.get('textarea');
textareaEl.value = textarea;

textareaEl.onchange = function () {
  hal9.set('textarea', this.value);
}

html.appendChild(textareaEl);
html.style.height = 'auto';
