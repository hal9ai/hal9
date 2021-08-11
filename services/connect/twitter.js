/**
  input: []
  params:
    - name: search
      label: 'Search'
      value:
        - control: 'textbox'
          value: tensorflow
  environment: worker
  cache: true
**/

var error = undefined;
var token = '';

var key = 'BQk4RE8wd7dOmJUEDOe1Pv0Xe';
var secret = 'ykVCD9QguMTaYSkJ8vYPKh0lPJCRrV4IddYemq56rlz0hYkoNm';

var operations = {
  search: async function(token) {
    // see https://developer.twitter.com/en/docs/twitter-api/tweets/search/integrate/build-a-rule
    var res = await fetch('https://api.twitter.com/1.1/search/tweets.json?q=' + search + '&result_type=recent&count=100', {
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
