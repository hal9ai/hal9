/**
  input: []
  output: [ textarea, html ]
  layout:
    - width: 900px
**/

var textarea = '';

const textareaEl = document.createElement('textarea');
textareaEl.rows = 5
textareaEl.style.width = 'calc(100% - 6px)';
textareaEl.style.resize = 'none';

let state = hal9.getState();
state = state ? state : {};

if (state.textarea) {
  textarea = state.textarea;
  textareaEl.value = textarea;
}

textareaEl.onchange = function () {
  state.textarea = this.value;
  hal9.setState(state);
  hal9.invalidate();
}

html.appendChild(textareaEl);
html.style.height = 'auto';
