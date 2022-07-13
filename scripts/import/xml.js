/**
  input: []
  params:
    - name: file
      label: 'File'
      value:
        - control: 'fileload'
          links:
            - name: 'url'
              label: 'Insert link'
            - name: 'file'
              label: 'Load file'
          selected: 'url'
          fileExt: '.xml'
          value: https://feeds.simplecast.com/54nAGcIl
    - name: root
      label: Root Element
      value:
        - control: textbox
          value: channel
    - name: rowname
      label: Row Element
      value:
        - control: textbox
          value: item
  deps:
    - https://cdn.jsdelivr.net/npm/arquero@latest
  cache: true
**/

file = file ? file : '';
var type = /^hal9:|^data:/.test(file) ? 'file' : 'url';

let xml = '';

if (type === 'url' && file != '') {
  const res = await fetch(file);
  xml = await res.text();
} else {
  file = atob(file.replace(/^.*;base64,/, ''));
  xml = file;
}

if (xml) {
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(xml, 'text/xml');

  const base = xmlDoc.getElementsByTagName(root)[0];

  data = [];
  for (var i = 0; i < base.childNodes.length; i++) {
    var row = {};
    var elem = base.childNodes[i];

    if (elem.nodeName != rowname) continue;

    for (var j = 0; j < elem.childNodes.length; j++) {
      var val = elem.childNodes[j];
      if (val.nodeType !== xmlDoc.ELEMENT_NODE || val.childNodes.length == 0) continue;

      row[val.nodeName] = val.childNodes[0].nodeValue;
    }

    data.push(row)
  }
} else {
  data = '';
}
