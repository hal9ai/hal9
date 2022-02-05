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
          fileExt: '.db,.sqlite'
          value: 'https://temphal9.s3.us-west-2.amazonaws.com/sqljs/sample.sqlite'
    - name: query
      label: Query
      value:
        - control: 'textbox'
          value: "SELECT name FROM sqlite_schema WHERE type IN ('table','view') 
AND name NOT LIKE 'sqlite_%'"
          lazy: true
  deps:
    - https://temphal9.s3.us-west-2.amazonaws.com/sqljs/sql-wasm.js
    - https://cdn.jsdelivr.net/npm/arquero@latest
  cache: true
**/

file = file ? file : '';
var type = /^hal9:|^data:/.test(file) ? 'file' : 'url';

var sqlBuffer = null;
if (type === 'url' && file != '') {
  const sqlData = await fetch(file);
  sqlBuffer = await sqlData.arrayBuffer();
} else {
  file = atob(file.replace(/^.*;base64,/, ''));
  sqlBuffer = Uint8Array.from(file, c => c.charCodeAt(0))
}

const config = {
  locateFile: filename => `https://temphal9.s3.us-west-2.amazonaws.com/sqljs/${filename}`
}

const SQL = await initSqlJs(config);
const db = new SQL.Database(new Uint8Array(sqlBuffer));

let sqldata = db.exec(query);

let columnHeaders = sqldata[0].columns;
let rows = sqldata[0].values;

let jsonArray = [];
for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
  let obj = {};
  for (let columnIndex = 0; columnIndex < rows[rowIndex].length; columnIndex++) {
    obj[columnHeaders[columnIndex]] = rows[rowIndex][columnIndex];
  }
  jsonArray.push(obj);
}

data = aq.from(jsonArray);
