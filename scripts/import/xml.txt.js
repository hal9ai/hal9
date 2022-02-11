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
          value: 'https://raw.githubusercontent.com/Emilianopp/School/master/t.xml?token=GHSAT0AAAAAABOQGH4SANBI46OKOTGQWGMOYQGUFUQ'
    
  deps: [
      'https://cdn.jsdelivr.net/npm/arquero@latest',
    'https://cdn.jsdelivr.net/npm/xmltojson@latest'
    ] 

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
  console.log(typeof file)
  xml = file;
  console.log(file)
}

if (xml) {
  console.log(typeof xml, 'second')
  j = xmlToJSON.parseString(xml)

  data = aq.fromJSON(text = j);
} else {
  data = '';
}
