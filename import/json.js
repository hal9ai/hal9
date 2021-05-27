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
          fileExt: '.json'
          value: 'https://raw.githubusercontent.com/d3/d3-hierarchy/master/test/data/flare.json'
  cache: true
**/

file = file ? file : '';
var type = /^hal9:|^data:/.test(file) ? 'file' : 'url';

if (type === 'url' && file != '') {
  const res = await fetch(file);
  data = await res.json();
} else {
  var value = atob(file.replace(/^.*;base64,/, ''));
  data = value ? JSON.parse(value) : '';
}
