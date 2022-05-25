/**
 output: [ 'data', 'html' ]
 deps:
 - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js
 **/

data = await hal9.utils.toRows(data);
var dataStr = JSON.stringify(data);
var dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);


var a = document.createElement('a');
a.href = dataUri
a.download = 'data.json';
a.innerHTML = 'Download data as JSON! \n'
//a.innerText += dataUri
a.style.display = 'block';

html.style.height = '50px';
html.style.textAlign = 'center';
html.appendChild(a);