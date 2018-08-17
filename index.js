const twitter = require('./twitter');
require('dotenv').config();
const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient();

let texts = []
twitter.getTweets()
.then(tweets => {
    tweets.statuses.forEach(status => {
    // texts.push(status.text);
    const document = {
      content: status.text,
      type: 'PLAIN_TEXT',
    };
    
    // client
    //   .analyzeEntitySentiment({document: document})
    //   .then(results => {
    //     const entities = results[0].entities;
    //     console.log(`Entities and sentiments:`);
    //     entities.forEach(entity => {
    //       console.log(`  Name: ${entity.name}`);
    //       console.log(`  Type: ${entity.type}`);
    //       console.log(`  Score: ${entity.sentiment.score}`);
    //       console.log(`  Magnitude: ${entity.sentiment.magnitude}`);
    //     });
    //   })
    //   .catch(err => {
    //     console.error('ERROR:', err);
    //   });
    client
    .analyzeSentiment({document: document})
    .then(results => {
      const sentiment = results[0].documentSentiment;
      console.log(`Document sentiment:`);
      console.log(`  Score: ${sentiment.score}`);
      console.log(`  Magnitude: ${sentiment.magnitude}`);
  
      const sentences = results[0].sentences;
      sentences.forEach(sentence => {
        console.log(`Sentence: ${sentence.text.content}`);
        console.log(`  Score: ${sentence.sentiment.score}`);
        console.log(`  Magnitude: ${sentence.sentiment.magnitude}`);
      });
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  });
});
