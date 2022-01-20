/**
  input: [ ]
  output: [ data ]
  params:
    - name: clientId
      label: 'Client ID'
      value:
        - control: 'textbox'         
    - name: projectNumber
      label: 'Project Name'
      value:
        - control: 'textbox'
    - name: query
      label: 'Query'
      value:
        - control: 'textbox'
    - name: dbLocation
      label: 'Database location'
      value:
        - control: 'textbox'
  deps:
    - https://apis.google.com/js/client.js
    - https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
    - https://cdn.jsdelivr.net/npm/apache-arrow@latest
    - https://cdn.jsdelivr.net/npm/arquero@latest
  cache: true
**/

let config = {
  'client_id': clientId,
  'scope': 'https://www.googleapis.com/auth/bigquery.readonly'
};

const authPromise = new Promise((accept, reject) => {
  gapi.auth.authorize(config, function () {
    gapi.client.load('bigquery', 'v2', function () {
      accept();
    });
  });
});

await authPromise;

let req = gapi.client.bigquery.jobs.query({
  'projectId': projectNumber,
  'resource': {
    'query': query,
    'location': dbLocation,
    'useLegacySql': false,
    'kind': 'bigquery#queryRequest'
  }
});

const dataPromise = new Promise((accept, reject) => {
  req.execute(function (response) {
    if (response.error) {
      reject(response.error.message);
      return;
    }

    // headers
    let headers = [];
    for (let field of response.schema.fields) {
      headers.push(field.name);
    }

    // rows as array of objects
    let rowObjects = [];
    for (let row of response.rows) {
      rowObjects.push(row.f);
    }

    // rows to simple array 
    let rows = [];
    for (let rowObject of rowObjects) {
      let row = [];
      for (let item of rowObject) {
        row.push(item.v);
      }
      rows.push(row);
    }

    // headers and rows to JSON form 
    let dataToJSON = [];
    for (const row of rows) {
      let obj = {};
      for (let headerIndex = 0; headerIndex < headers.length; headerIndex++) {
        obj[headers[headerIndex]] = row[headerIndex];
      }
      dataToJSON.push(obj);
    }

    // data to arquero 
    accept(aq.from(dataToJSON));
  });
});

data = await dataPromise;
