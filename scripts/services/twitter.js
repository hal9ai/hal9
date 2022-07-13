/**
  input: []
  params:
    - name: search
      label: 'Search'
      value:
        - control: 'textbox'
          value: tensorflow
          lazy: true
    - name: key
      label: 'Twitter Key'
      value:
        - control: 'textbox'
          lazy: true
    - name: secret
      label: 'Twitter Secret'
      value:
        - control: 'textbox'
          lazy: true
    - name: type
      label: Type
      value:
        - control: select
          value: mixed
          values:
            - name: mixed
              label: Mixed
            - name: recent
              label: Recent
            - name: popular
              label: Popular
  environment: worker
  cache: true
**/

var error = undefined;
var token = '';

var operations = {
  search: async function(token) {
    // see https://developer.twitter.com/en/docs/twitter-api/tweets/search/integrate/build-a-rule
    var res = await fetch('https://api.twitter.com/1.1/search/tweets.json?q=' + search + '&result_type=' + type + '&count=100', {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    if (!res.ok) throw await res.text();

    var twitter = await res.json(); 
    
    return twitter.statuses;
  }
}

var op = operations['search'];
if (op) {
  try {
    var res = await fetch('https://api.twitter.com/oauth2/token?grant_type=client_credentials', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(key + ':' + secret),
        'cache': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });

    if (!res.ok) throw await res.text();
    token = (await res.json()).access_token;

    data = await op(token);
  }
  catch (e) {
    data = [ { error: e.toString() } ];
  }
}
