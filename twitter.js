const Twitter = require('twitter');

async function getTweets() {
  let tweets = {};
  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });
  let tweetsArr = []
  const params = {
    q: 'BBC* -from:BBc* filter:retweets ',
    lang: 'en',
    count: 2000
  };
  tweets = await client.get('search/tweets', params) 
  .then(tweets => {
    return tweets;
  });

  // do {
  //   console.log('ey up')
  //   params.max_id = tweets.statuses[0].id
  //   tweets = await client.get('search/tweets', params) 
  //   .then(tweets => {
  //     return tweets;
  //   });
  //   tweetsArr.push(tweets);
  //   return tweets;
  // } while (tweets);
  // console.log('tweetsArr', tweetsArr)
  // return tweetsArr;
  return tweets;
}

module.exports = {
  getTweets
}