const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8082;
const { scrapeGR } = require('./goodReads');
const app = express();
const cron = require('node-cron');
const { genres } = require('./goodReads/genres.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

cron.schedule('20 12 * * *', () => {
  console.log('starting scrape');
  scrapeGR(genres);
});