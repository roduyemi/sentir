const twitter = require('./twitter');
require('dotenv').config();
const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient();
const axios = require('axios');

getSentiment = async () => {
  const allSentiments = [];
  await twitter.getTweets()
  .then(async tweets => {
    for (status of tweets.statuses) {
      await callSentimentApi(status.text)
      .then(sentiment => {
        const score = sentiment.sentiment;
        const magnitude = sentiment.magnitude;
        allSentiments.push({
          sentiment: score,
          magnitude,
          x: Math.round(score * 100),
          y: Math.round(magnitude * 100),
          text: status.text
        });
        return allSentiments;
      });
    }
  });
  return allSentiments;
}

callSentimentApi = (status) => {
  const data = axios.get(`${process.env.API_URL}?tweet=${encodeURIComponent(status)}`)
  .then(response =>  {
    const data = response.data;
    return data;
  })
  .catch(error => {
    console.log(error);
  });
  return new Promise((resolve, reject) => {
    data ? resolve(data) : reject('no data');
  });
}

module.exports = {
  getSentiment
}
