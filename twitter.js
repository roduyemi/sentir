const Twitter = require('twitter');

async function getTweets() {
  let tweets = {};
  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });
  
  const params = {
    q: 'BBC*',
    lang: 'en',
    count: 20
  };
  tweets = await client.get('search/tweets', params) 
  .then(function(tweets) {
    return tweets;
  });
  return tweets;
}

module.exports = {
  getTweets
}