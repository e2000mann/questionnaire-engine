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

// for get /getQuestionnaires
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
    return res.json([]);
  }
}

// for get /check
async function checkQuestionnaireExists(req, res) {

  const query = {
    text: 'SELECT id FROM up887818web WHERE name = $1',
    values: [req.query.name]
  };

  try {
    let result = await sendQuery(query, "one");
    if (result != null) {
      console.log("result found");
      return res.send(result.id);
    } else {
      console.log("result not found");
      return res.send("");
    }
  } catch (e) {
    console.log(e);
    return res.send("");
  }
}

// for get /load
function getQuestionnaire(req, res) {
  let jsonLocation = `client/questionnaires/${req.query.id}/${req.query.id}.json`;
  let jsonFile = JSON.parse(fs.readFileSync(jsonLocation, 'utf8'));
  res.json(jsonFile);
}

// for get /checkForResponses
function checkForResponses(req, res) {
  const location = `client/questionnaires/${req.query.id}/${req.query.filename}`;
  console.log(location);
  const fileExists = fs.existsSync(location);
  console.log(fileExists);
  return res.send(fileExists);
}

// for get /submit
async function uploadResults(req, res) {
  const id = req.query.id;
  const response = {
    date: new Date(),
    answers: JSON.parse(req.query.answers)
  };

  const query = {
    text: 'SELECT json FROM up887818web WHERE id=$1',
    values: [id]
  };

  try {
    let result = await sendQuery(query, "one");
    // true = json; false = csv
    if (result == "t") {
      uploadJson(id, response);
    } else {
      uploadCsv(id, response);
    }
  } catch (e) {
    console.log(e);
  }
}

function uploadJson(id, response) {
  const jsonLocation = `client/questionnaires/${id}/responses.json`;
  let output = {};
  const fileExists = fs.existsSync(jsonLocation);
  if (fileExists) {
    console.log("file exists");
    output = JSON.parse(fs.readFileSync(jsonLocation));
    output.responses.push(response);
  } else {
    output = {
      responses: [response]
    };
  }
  console.log(output);
  // append new data
  fs.writeFile(jsonLocation, JSON.stringify(output), {
    flag: 'w'
  }, function(err) {
    if (err) throw err;
    console.log("wrote to file");
  });
}

function uploadCsv(id, response) {
  const csvLocation = `client/questionnaires/${id}/responses.csv`;
  const answersArray = [];
  for (const item of Object.values(response.answers)) {
    answersArray.push(item.answer);
  }
  console.log(answersArray);
  let output = [response.date, answersArray];
  fs.appendFile(csvLocation, output.toString(), function(err) {
    if (err) throw err;
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
  const jsonLocation = `client/questionnaires/${id}/${id.json}`;
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
// check if responses exists
app.get('/checkForResponses', checkForResponses);

// post requests (sending data)
app.post('/submit', uploadResults);
app.post('/create', addQuestionnaire);
app.post('/edit', editQuestionnaire);

app.listen(8080);