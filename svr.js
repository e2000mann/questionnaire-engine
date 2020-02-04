const express = require('express');
const app = express();

app.use(express.static('client'));

app.add('/questionnaire', (req, res) => {
  console.log(req.query);
});

app.listen(8080);