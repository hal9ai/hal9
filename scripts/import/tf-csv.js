/**
  output:
    - data
    - stats
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
  deps: [ 'https://cdn.jsdelivr.net/npm/danfojs@0.2.4/lib/bundle.min.js' ]
  cache: true
**/

file = file ? file : '';
var type = file.startsWith("data:") ? 'file' : 'url';

const dsvParser = d3.dsvFormat(separator || ',');

let csv = '';

if (type === 'url') {
  const res = await fetch(file);
  csv = await res.text();
} else {
  file = atob(file.replace(/^.*;base64,/, ''));
  csv = file;
}

data = await dfd.read_csv(file);

stats = data.describe()
