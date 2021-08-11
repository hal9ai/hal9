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
  deps: [ 'https://cdnjs.cloudflare.com/ajax/libs/d3/6.2.0/d3.min.js' ]
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
  if (skip) {
    var withsplit = csv.split('\n');
    withsplit.splice(0, skip);
    csv = withsplit.join('\n');
  }
  data = dsvParser.parse(csv);
  data = data.filter(d => {
    if (typeof(d) === 'undefined') return false;
    if (filter === undefined || JSON.stringify(d).includes(filter)) return true;
  })
} else {
  data = '';
}
