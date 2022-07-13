/**
  input: []
  output: [ data ]
  params: 
    - name: url
      label: 'URL'
      value:
        - control: 'textbox'
          lazy: true
          value: 'https://api.gdc.cancer.gov/cases'
    - name: query
      label: 'Query'
      value:
        - control: 'textbox'
          lazy: true
          value: '{}'
    - name: extract
      label: 'Extract'
      value:
        - control: 'textbox'
          lazy: true
          value: 'data.data.hits'
**/

const response = await fetch(
  url,
  {
    method: 'post',
    body: query,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': query.length,
    },
  }
);

data = await response.json();

var extractexpr = new Function('data', 'return ' + extract + ';');

data = extractexpr(data);
