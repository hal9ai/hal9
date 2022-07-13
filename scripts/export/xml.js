/**
 output: [ 'data', 'html' ]
 deps:
 - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js
 **/

data = await hal9.utils.toRows(data);
dataStr = ''

for (i in data){
    dataStr += "<" + i +">\n"
    for (j in data[i]){
        dataStr += "  <" + j +">"
        dataStr +=  data[i][j]
        dataStr += "  </" + j +">\n"
    }
    dataStr += "</" + i +">\n"
}


var dataUri = 'data:application/xml;charset=utf-8,'+ encodeURIComponent(dataStr);


var a = document.createElement('a');
a.href = dataUri
a.download = 'data.xml';
a.innerHTML = 'Download data as XML! \n'
//a.innerText += dataStr
a.style.display = 'block';

html.style.height = '50px';
html.style.textAlign = 'center';
html.appendChild(a);