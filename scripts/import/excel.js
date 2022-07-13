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
          value: 'https://prodhal9.s3.us-west-2.amazonaws.com/users/7be30db96302d198035cec0d76c8ce7a_46079/file_example_XLSX_100.csv'
  deps: [
    'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.12.4/xlsx.core.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/d3/6.2.0/d3.min.js'
  ]
  cache: true
**/

const updateSheetControl = function(sheets) {
  var params = hal9.getParams();
  params['sheet'] = {
    id: 2,
    name: 'sheet',
    label: 'Sheet',
    value: [
      {
        control: 'select',
        value: typeof(sheet) != 'undefined' ? sheet : '0',
        values: sheets.map((e, idx) => Object.assign(e, { name: idx, label: e }))
      }
    ]
  }
  
  hal9.setParams(params);
}

file = file ? file : '';
var type = /^hal9:|^data:/.test(file) ? 'file' : 'url';

const fixCsvForD3 = csv => {
  const first = csv.match(/.*\n/);
  if (first && first[0].match(/,,/)) {
    const fixed = first[0].replace('\n', '').split(',').map((e, idx) => {
      if (e.length == 0) return 'Column' + idx;
      return e;
    });
    return csv.replace(/.*\n/, fixed + '\n');
  }

  return csv;
}

const onParseCSV = buffer => {
  const arraybuffer = new Uint8Array(buffer);
  let binary = '';

  for (let i = 0; i < arraybuffer.length; i++) {
    binary += String.fromCharCode(arraybuffer[i]);
  }

  const file = XLSX.read(binary, { type: 'binary' });

  updateSheetControl(file.SheetNames);
  var sheetName = file.SheetNames[0];
  if (typeof(sheet) != 'undefined') sheetName = file.SheetNames[sheet];
  const csv = XLSX.utils.sheet_to_csv(file.Sheets[sheetName]);
  const fixed = fixCsvForD3(csv);
  
  data = d3.csvParse(fixed);
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
