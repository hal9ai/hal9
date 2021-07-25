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
          fileExt: '.csv'
          value: 'https://raw.githubusercontent.com/javierluraschi/datasets/datasets/aapl/data.csv'
    - name: separator
      label: 'Separator'
      value:
        - control: 'textbox'
          value: ','
    - name: skip
      label: 'Skip'
      value:
        - control: 'textbox'
          value: ''
    - name: filter
      label: Filter
      value:
        - control: 'textbox'
  deps: [ "https://cdn.jsdelivr.net/npm/arquero@latest"' ]
  cache: true
**/

file = file ? file : '';
var type = /^hal9:|^data:/.test(file) ? 'file' : 'url';

const dsvParser = d3.dsvFormat(separator || ',');

let csv = '';

if (type === 'url' && file != '') {
  const res = await fetch(file);
  csv = await res.text();
} else {
  file = atob(file.replace(/^.*;base64,/, ''));
  csv = file;
}

if (csv) {
  data = aq.fromCSV(text= csv, delimiter = seperator)
} else {
  data = '';
}
