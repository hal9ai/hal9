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
          type: 'buffer'
          fileExt: '.xls, .xlsx'
          value: 'https://file-examples-com.github.io/uploads/2017/02/file_example_XLSX_100.xlsx'
  deps: [
    'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.12.4/xlsx.core.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/d3/6.2.0/d3.min.js'
  ]
  cache: true
**/

file = file ? file : '';
var type = /^hal9:|^data:/.test(file) ? 'file' : 'url';

const onParseCSV = buffer => {
  const arraybuffer = new Uint8Array(buffer);
  let binary = '';

  for (let i = 0; i < arraybuffer.length; i++) {
    binary += String.fromCharCode(arraybuffer[i]);
  }

  const file = XLSX.read(binary, { type: 'binary' });
  const csv = XLSX.utils.sheet_to_csv(file.Sheets[file.SheetNames[0]]);

  data = d3.csvParse(csv);
};

var BASE64_MARKER = ';base64,';

function dataUriToUint8Array(dataURI) {
  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var base64 = dataURI.substring(base64Index);
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));

  for(i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

if (!file) {
  data = '';
} else if (type === 'url') {
  const res = await fetch(file);
  const buffer = await res.arrayBuffer();

  onParseCSV(buffer);
} else {
  const blob = dataUriToUint8Array(file);
  onParseCSV(blob);
}

if (data) data = data.filter(d => typeof(d) !== 'undefined')
