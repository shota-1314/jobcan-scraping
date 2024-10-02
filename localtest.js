const express = require('express');
const bodyParser = require('body-parser');
const { scrapeUrl } = require('./index');

const app = express();
app.use(bodyParser.json()); // JSONボディのパース
app.use(bodyParser.urlencoded({ extended: true })); // URLエンコードされたボディのパース

app.post('/test', scrapeUrl);

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});