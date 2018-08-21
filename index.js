const twitter = require('./twitter');
require('dotenv').config();
const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient();

let polarity = {
  positive: 0,
  negative: 0,
  neutral: 0
}

getSentiment = async () => {
  const allSentiments = [];
  await twitter.getTweets()
  .then(async tweets => {
    for (status of tweets.statuses) {
      const document = {
        content: status.text,
        type: 'PLAIN_TEXT',
      };
      // await client
      // .analyzeSentiment({document: document})
      // .then(
      //   results => {
      //   const sentiment = results[0].documentSentiment;
        // console.log(`Document sentiment:`);
        // console.log(`  Score: ${sentiment.score}`);
        // calculateSentiment(Math.random());
        // console.log(`  Magnitude: ${sentiment.magnitude}`);

        // const score = sentiment.score,
        //       magnitude = sentiment.magnitude;
        const score = Math.random(),
              magnitude = Math.random();
        allSentiments.push({
          sentiment: score,
          magnitude,
          x: Math.round(score * 100),
          y: Math.round(magnitude * 100),
          text: status.text
        });
    
        // const sentences = results[0].sentences;
        // sentences.forEach(sentence => {
        //   console.log(`Sentence: ${sentence.text.content}`);
        //   console.log(`  Score: ${sentence.sentiment.score}`);
        //   console.log(`  Magnitude: ${sentence.sentiment.magnitude}`);
        // });
        // return allSentiments;
      // })
      // .catch(err => {
      //   console.error('ERROR:', err);
      // });
    }
  });
  return allSentiments;
}

module.exports = {
  getSentiment
}
