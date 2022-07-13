/**
  input: [ ]
  output: [ data ]
  params:
    - name: url
      label: 'Google sheets link'
      value:
        - control: 'textbox' 
          value: ''       
    - name: documentAccess
      label: 'private/public document'
      value:
        - control: 'select' 
          value: ''
          values:
            - name: private
              label: Private      
            - name: public
              label: Public       
    - name: sheet
      label: 'Sheet Name'
      value:
        - control: 'textbox'

    - name: clientId
      label: 'Client ID'
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
  'scope': 'https://www.googleapis.com/auth/spreadsheets.readonly'
};

// public sheet
if (documentAccess === 'public') {
  let documentId_sheetId = url.replace('https://docs.google.com/spreadsheets/d/', '')
                              .split('/edit#gid=');

  let exportUrl = 'https://docs.google.com/spreadsheets/d/' + documentId_sheetId[0] + '/export?format=csv&gid=' + documentId_sheetId[1];

  data = aq.fromCSV(await fetch(exportUrl).then(res => res.text()));
}

// private sheet
else if (documentAccess === 'private') {
  const authPromise = new Promise((accept, reject) => {
    gapi.auth.authorize(config, function () {
      accept();
    });
  });

  await authPromise;
  let token = gapi.auth.getToken().access_token;
  let documentId_sheetId = url.replace('https://docs.google.com/spreadsheets/d/', '')
                              .split('/edit#gid=');
  let valuesUrl = 'https://sheets.googleapis.com/v4/spreadsheets/' + documentId_sheetName[0] + '/values/' + sheet + '!A:Z';

  let googleData = await fetch(valuesUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    }
  }).then(res => res.json());


  let headers = googleData.values.shift();
  let rows = googleData.values;

  // concat json
  let dataToJSON = [];
  for (const row of rows) {
    let obj = {};
    for (let headerIndex = 0; headerIndex < headers.length; headerIndex++) {
      obj[headers[headerIndex]] = row[headerIndex];
    }
    dataToJSON.push(obj);
  }

  // data to arquero 
  data = aq.from(dataToJSON);
}