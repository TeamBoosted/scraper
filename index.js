const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8082;
const { scrapeGR } = require('./goodReads');
const app = express();
const cron = require('node-cron');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

cron.schedule('* 18 * * *', () => {
  console.log('starting scrape');
  scrapeGR();
});