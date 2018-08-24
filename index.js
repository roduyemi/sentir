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
      .then(async sentiment => {
        const score = sentiment.sentiment;
        const magnitude = sentiment.magnitude;
        // const id = await getTwitterJson(status.id_str).then(json => { return json; })
        allSentiments.push({
          sentiment: score,
          magnitude,
          x: Math.round(score * 100),
          y: Math.round(magnitude * 100),
          text: status.text,
          id: status.id_str
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

getTwitterJson = (id) => {
  const json = axios.get(`https://publish.twitter.com/oembed?url=https://twitter.com/Interior/status/${encodeURIComponent(id)}`)
  .then(response => {
    const data = response.data.html;
    return data;
  })
  .catch(error => {
    console.log(error);
  })
  return new Promise((resolve, reject) => {
    json ? resolve(json) : reject('no data');
  });
}

module.exports = {
  getSentiment
}
