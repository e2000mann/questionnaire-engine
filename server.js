//up887818 server
'use strict';

//Libraries
const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.static('client'));

function getJsonFile(req, res) {
  let jsonLocation = `${req.query.name}/${req.query.name}.json`;
  let jsonFile = JSON.parse(fs.readFileSync(jsonLocation, 'utf8'));
  res.json(jsonFile);
}

function getImageFolder(req, res) {
  const name = req.query.name;
  const id = req.query.id;
  const imageLocation = `${name}/${id}`;
  res.json(imageLocation);
}

function uploadResults(req, res) {
  const d = new Date();
  if (req.query.type === "csv") {
    console.log(`csv exported at ${d.toUTCString()}`);
  } else {
    console.log(`json exported at ${d.toUTCString()}`);
  }
}

app.get('/q', getJsonFile);
app.post('/q', uploadResults)

app.get('/i', getImageFolder);

app.listen(8080);