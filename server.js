//up887818 server
'use strict';

//Libraries
const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.static('client'));

app.get('/q', (req, res) => {
  let jsonLocation = `${req.query.name}/${req.query.name}.json`;
  let jsonFile = JSON.parse(fs.readFileSync(jsonLocation, 'utf8'));
  res.json(jsonFile);
});

app.listen(8080);