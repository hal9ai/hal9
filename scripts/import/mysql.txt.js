/**
  input: []
  params:
    - name: host
      label: 'Host'
      value:
        - control: 'textbox'
          value: ''
          lazy: true
    - name: user
      label: 'User'
      value:
        - control: 'textbox'
          value: ''
          lazy: true
    - name: password
      label: 'Password'
      value:
        - control: 'textbox'
          value: ''
          lazy: true
    - name: database
      label: 'Database'
      value:
        - control: 'textbox'
          value: ''
          lazy: true
    - name: query
      label: 'Query'
      value:
        - control: 'textbox'
          value: 'SELECT 1'
          lazy: true
  output:
    - data
  environment: worker
  cache: true
**/

const db = mysql.createPool({
  host: host,
  user: user,
  password: password,
  database: database
});

const waitDB = new Promise((accept, reject) => {
  try {
    db.query(query, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      
      accept(result);
    })
  }
  catch(e) {
    reject(e);
  }
});

data = await waitDB;
