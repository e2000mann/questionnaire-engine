//up887818 server
'use strict';

//Libraries
const express = require('express');
const fs = require('fs');
const multer = require('multer');
const upload = multer({
  dest: 'uploads'
});

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
  // id is used to find where to store response
  const id = req.query.id;

  const response = {
    date: new Date(),
    answers: req.body
  };

  const query = {
    text: 'SELECT json FROM up887818web WHERE id=$1',
    values: [id]
  };

  try {
    let result = await sendQuery(query, "one");
    // true = json; false = csv
    if (result == "t") {
      res.send(uploadJson(id, response));
    } else {
      res.send(uploadCsv(id, response));
    }
  } catch (e) {
    console.log(e);
    res.send(false);
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
    return true;
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
    return true;
  });
}


// for get /create
async function uniqueName(name) {
  // giving each questionnaire a unique name keeps my load function working :)
  let validName = false;
  let attempts = 0;
  let testName = "";

  while (!validName) {
    // e.g. If someone tries to make a questionnaire named "Example Questionnaire"
    // it would instead be called "Example Questionnaire 1"
    attempts == 0 ? testName = name : testName = `${name} ${attempts}`;
    console.log(testName);
    const query = {
      text: 'SELECT id FROM up887818web WHERE name = $1',
      values: [testName]
    };
    try {
      let testResult = await sendQuery(query, "one");
      if (testResult != null) {
        attempts++;
      } else {
        validName = true;
      }
    } catch (e) {
      console.log(e);
    }
  }

  return testName;
}

async function addQuestionnaire(req, res) {
  const data = req.body;
  const name = await uniqueName(data.name);
  data.name = name;
  console.log(data.name);
  const userEmail = req.query.email;
  const json = req.query.json;
  const id = req.query.id;
  // upload data as file
  const jsonDir = `client/questionnaires/${id}`;
  fs.mkdir(jsonDir, {
    recursive: true
  }, function(err) {
    if (err) throw err;
  });
  const jsonLocation = `${jsonDir}/${id}.json`;
  fs.writeFile(jsonLocation, JSON.stringify(data), {
    flag: 'w'
  }, function(err) {
    if (err) throw err;
    console.log("wrote to file");
  });

  // add new field to database
  const query = {
    text: "INSERT into up887818web values ($1, $2, $3, $4);",
    values: [id, name, userEmail, json]
  };
  await sendQuery(query, "none");
  // returns name incase uniqueName changed name
  res.send(name);
}

async function addImages(req, res, next) {

  // define variables
  const id = req.body.id;
  const name = req.body.name;
  const images = req.files;

  // create directory for images
  const imageDir = `client/questionnaires/${id}/${name}`;
  fs.mkdirSync(imageDir, {
    recursive: true
  });

  for (let i = 0; i < images.length; i++) {
    // store images in new directory using original name instead of random
    // name generated by multer. this is due to the way the images are loaded
    // in when a questionnaire is called.
    const image = images[i];
    console.log(image);
    const newPath = `${imageDir}/${image.originalname}`;
    await fs.renameSync(image.path, newPath);
  }
  res.send(true);
}

// get requests
//login
app.get('/getQuestionnaires', getUsersQuestionnaires);
app.get('/check', checkQuestionnaireExists);
//load
app.get('/load', getQuestionnaire);
// check if responses exists
app.get('/checkForResponses', checkForResponses);
// get uuid
app.get('/uuid', (req, res) => {
  res.send(uuid());
});

// post requests (sending data)
// uploading responses
app.post('/submit', express.json(), uploadResults);

//uploading questionnaires (inc. image support)
app.post('/create', express.json(), addQuestionnaire);
app.post('/images', upload.any(), addImages);

app.listen(8080);