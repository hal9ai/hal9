/**
  deps: ['https://cdn.jsdelivr.net/npm/arquero@latest', 'https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js']
  cache: true
  params:
    - name: type
      label: Type
      value:
        - control: select
          value: submissions
          values:
            - name: submissions
              label: Submissions
            - name: comments
              label: Comments
    - name: sub
      label: Subreddit
      value:
        - control: 'textbox'
          value: wallstreetbets
    - name: query
      label: Query
      value:
        - control: 'textbox'
          value: GME
    - name: before
      label: Before
      value:
        - control: 'textbox'
          value: 1 Jan 2021
    - name: after
      label: After
      value:
        - control: 'textbox'
          value: 1 Jan 2020
**/
aft = new Date(after).getTime() / 1000;
bfr = new Date(before).getTime() / 1000;
const baseUrl = 'https://api.pushshift.io/';
if (type == 'submissions') {
  endPoint = '/reddit/search/submission/';
} else {
  endPoint = '/reddit/search/comment/';
}
url = baseUrl + endPoint + '?q=' + query +'&size=1000&fields=author,created_utc,full_link,selftext,body,title,num_comments,score&sort=asc';
if (sub) {
  url = url+ '&subreddit=' + sub;
}
if (bfr) {
  url = url + '&before='+bfr;
} if (aft) {
  url = url + '&after='+aft;
}
const res = await fetch(url);
data = await res.json();
data = data.data;
data = await hal9.utils.toArquero(data);
time_arr = data.array('created_utc')
last_entry = time_arr[time_arr.length - 1]
while (last_entry < before) { 
    aft = last_entry - 1;
    bfr = bfr;
    if (type == 'submissions') {
      endPoint = '/reddit/search/submission/';
    } else {
      endPoint = '/reddit/search/comment/';
    }
      url = baseUrl + endPoint + '?q=' + query +'&size=500&fields=author,created_utc,full_link,selftext,body,title,num_comments,score&sort=asc';
    if (sub) {    url = url+ '&subreddit=' + sub; }
    if (bfr) {
      url = url + '&before='+bfr;
    }
    if (aft) {    
    url = url + '&after='+aft;
    }
  const res = await fetch(url);
  newData = await res.json();
  newData = newData.data;
  console.log(data.size)
  newData = await hal9.utils.toArquero(newData);  
  data = data.concat(newData);
  console.log(data.size)
  time_arr = data.array('created_utc');
  last_entry = time_arr[time_arr.length - 1];
  if (newData.size <100){
   break;
  }
  await new Promise(r => setTimeout(r, 1000));
}
data = data.dedupe();


