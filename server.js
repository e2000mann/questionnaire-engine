//up887818 server
'use strict';

//Libraries
const express = require('express');
const fs = require('fs');

//Server
const app = express();
app.use(express.static('client'));

//Database
const {
  Client
} = require('pg');

async function sendQuery(query, output) {
  //"output" parameter options:
  // default: no output given
  // "one": one row of output given (results.rows[0])
  // "all": all rows of output given

  // Setting up client - each query requires a new client
  const client = new Client({
    database: `up887818`,
    user: `serverconnect`,
    password: `webProgCw`
  });
  client.connect();

  try {
    // Send query
    let results = await client.query(query);
    await console.log(results);
    await client.end();

    // Return results based off "output" parameter
    if (output === "all") {
      return results.rows;
    }
    if (output === "one") {
      return results.rows[0];
    } else {
      return;
    }
  } catch (e) {
    console.error(e.stack);
    client.end();
    return;
  }
}


function checkQuestionnaireExists(req, res) {
  let result = fs.existsSync(`client/questionnaires/${req.query.name}`);
  res.send(result.toString());
}

function getJsonFile(req, res) {
  let jsonLocation = `client/questionnaires/${req.query.name}/${req.query.name}.json`;
  let jsonFile = JSON.parse(fs.readFileSync(jsonLocation, 'utf8'));
  res.json(jsonFile);
}

// function getImageFolder(req, res) {
//   const name = req.query.name;
//   const id = req.query.id;
//   const imageLocation = `questionnaires/${name}/${id}`;
//   res.json(imageLocation);
// }

function uploadResults(req, res) {
  const d = new Date();
  if (req.query.type === "csv") {
    console.log(`csv exported at ${d.toUTCString()}`);
  } else {
    console.log(`json exported at ${d.toUTCString()}`);
  }
}

app.get('/check', checkQuestionnaireExists);

app.get('/q', getJsonFile);
app.post('/q', uploadResults)

// app.get('/i', getImageFolder);

app.listen(8080);