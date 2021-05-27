/**
  input: []
  params:
    - sources
    - operation
    - name: operation
      label: Operation
      value:
        - control: select
          value: search
          values:
            - name: search
              label: Search
            - name: followers
              label: Followers
  environment: worker
  cache: true
**/

var error = undefined;
var token = '';

var key = 'BQk4RE8wd7dOmJUEDOe1Pv0Xe';
var secret = 'ykVCD9QguMTaYSkJ8vYPKh0lPJCRrV4IddYemq56rlz0hYkoNm';

var operations = {
  followers: async function(token) {
    // see https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/user
    var res = await fetch('https://api.twitter.com/2/users/2244994945/followers?user.fields=' +
      'username,profile_image_url,url,public_metrics', {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    if (!res.ok) throw await res.text();

    var twitter = await res.json(); 

    twitter = twitter.data.map(e => {
      e.followers_count = e.public_metrics.followers_count;
      delete e.public_metrics;
      return e;
    });

    return twitter.slice(1, 50);
  },
  search: async function(token) {
    // see https://developer.twitter.com/en/docs/twitter-api/tweets/search/integrate/build-a-rule
    var res = await fetch('https://api.twitter.com/1.1/search/tweets.json?q=nasa&result_type=popular', {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    if (!res.ok) throw await res.text();

    var twitter = await res.json(); 
    
    return twitter.statuses;
  }
}

var op = operations[operation];
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
