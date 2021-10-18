/**
  output: [ html ]
  params: [ tweetid ]
  deps: [ 'https://platform.twitter.com/widgets.js' ]
**/

data.map((e) =>
  twttr.widgets.createTweet(e[tweetid], html, {})
)
