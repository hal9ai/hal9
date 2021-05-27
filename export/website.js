
var textarea = document.createElement('textarea');
textarea.value = hal9.getHtml();

textarea.style = `
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  margin-left: 5px;
  margin-top: 5px;
  border: 1px solid #f1f1f1;
`;

html.appendChild(textarea);
