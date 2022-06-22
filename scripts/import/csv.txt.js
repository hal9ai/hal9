/**
  input: []
  description: Import CSV files as a dataframe 
  params:
    - name: file
      label: 'File'
      description: Either the URL for the csv or a local file.
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
      description:  A single-character delimiter string between column values (default ',')
      value:
        - control: 'textbox'
          value: ','
    - name: skip
      label: 'Skip'
      description: The number of lines to skip (default 0) before reading data
      value:
        - control: 'number'
          value: ''
  deps:
    - https://cdn.jsdelivr.net/npm/arquero@latest
  cache: true
**/

file = file ? file : '';
var type = /^hal9:|^data:/.test(file) ? 'file' : 'url';

let csv = '';

if (type === 'url' && file != '') {
  const res = await fetch(file);
  csv = await res.text();
} else {
  file = decodeURIComponent(escape(atob(file.replace(/^.*;base64,/, ''))));
  csv = file;
}

if (skip) {
  const lines = csv.split('\n');
  csv = lines.slice(skip).join('\n');
}

if (csv) {
  data = aq.fromCSV(text = csv, delimiter = separator);
} else {
  data = '';
}
