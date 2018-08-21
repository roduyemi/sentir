const express = require('express');
const app = express();
const port = 3000;
const scatter = require('./scatter');
const index = require('./index.js');

app.use(express.static(__dirname));

app.get('/', (request, response) => {
    response.send(scatter);
  });

app.get('/scatter', (request, response) => {

    console.log('-----plotting scatterplot-----');

    index.getSentiment()
    .then(sentiment => {
        response.send(sentiment);
    })
    .catch((err) => {
        response.status(500).send({ error: err.message });
    });

});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
});