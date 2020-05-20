//up887818 server
'use strict';

//Libraries
const express = require('express');
const fs = require('fs');

//Server
const app = express();
app.use(express.static('client'));

//Database
const uuid = require('uuid-random');
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
    database: "up887818web",
    user: "serverconnect",
    password: "webProgCw"
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

// for post /getQuestionnaires
async function getUsersQuestionnaires(req, res) {
  const email = req.query.email;

  const query = {
    text: 'SELECT * FROM up887818web WHERE email = $1',
    values: [email],
  };

  try {
    let results = await sendQuery(query, "all");
    return res.json(results);
  } catch (e) {
    console.log(e);
    return {};
  }
}

// for post /check
function checkQuestionnaireExists(req, res) {
  let result = fs.existsSync(`client/questionnaires/${req.query.name}`);
  res.send(result.toString());
}

// for post /load
function getQuestionnaire(req, res) {
  let jsonLocation = `client/questionnaires/${req.query.name}/${req.query.name}.json`;
  let jsonFile = JSON.parse(fs.readFileSync(jsonLocation, 'utf8'));
  res.json(jsonFile);
}


// for get /submit
function uploadResults(req, res) {
  const d = new Date();
  const title = req.query.q;
  const answers = JSON.parse(req.query.answers);
  const jsonLocation = `client/questionnaires/${title}/responses.json`;
  fs.readFile(jsonLocation, (err, data) => {
    return "error in reading file";
  });
  // append new data
  fs.writeFile(jsonLocation, (err, data) => {
    return "error in writing file";
  });

}


// for get /create
async function addQuestionnaire(req, res) {
  const data = JSON.parse(req.query.data);
  const name = json.name;
  const userEmail = req.query.email;
  const json = req.query.json;
  const id = uuid();
  // upload data as file
  const jsonLocation = `client/questionnaires/${name}/${name.json}`;
  fs.appendFile(jsonLocation, data, function(err) {
    reject("error in writing file");
  });

  // add new field to database
  const query = {
    text: "INSERT into up887818 values ($1, $2, $3);",
    values: [id, userEmail, json]
  };
  await sendQuery(query, "none");
}


// for get /edit
async function editQuestionnaire(req, res) {
  const data = JSON.parse(req.query.data);
  const name = json.name;
  // upload data as file
  const jsonLocation = `client/questionnaires/${name}/${name.json}`;
  fs.appendFile(jsonLocation, data, function(err) {
    reject("error in writing file");
  });
}

// get requests
//login
app.get('/getQuestionnaires', getUsersQuestionnaires);
app.get('/check', checkQuestionnaireExists);
//load
app.get('/load', getQuestionnaire);

// put requests (sending data)
app.post('/submit', uploadResults);
app.post('/create', addQuestionnaire);
app.post('/edit', editQuestionnaire);

app.listen(8080);