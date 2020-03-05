//up887818
'use strict';

// imports createSection function from htmlgenerator.js
import {
  createSection
} from './htmlgenerator.js';

//functions
async function fetchQuestionnaire() {
  let name = localStorage.getItem("questionnaire-name");

  let url = `/q?name=${name}`;

  let response = await fetch(url);
  const questionnaire = await response.json();

  let myh1 = document.createElement("h1");
  myh1.textContent = questionnaire.name;
  document.body.prepend(myh1);

  questionnaire.questions.forEach(createSection);
}

function makeObjectFromQuestionnaire() {
  let object = {};

  object.name = document.getElementsByTagName("h1")[0].textContent;

  object.questions = [];
  let questions = document.getElementsByTagName("section");

  for (const question of questions) {
    let info = {};
    info.id = question.id;
    if (question.classList.contains("select")) {
      info.answers = findCheckedBoxes(question);
    } else {
      let answer = question.querySelector("input");
      info.answers = answer.value;
      console.log(object);
    }

    object.questions.push(info);
  }

  console.log(object);
  return object;
}


function findCheckedBoxes(q) {
  return "test";
}


async function exportToJson() {
  let object = makeObjectFromQuestionnaire();
  let url = "/q?name=example-questionnaire&type=json";
  const response = await fetch(url, {
    method: 'POST'
  });
}


async function exportToCsv() {
  let url = "/q?name=example-questionnaire&type=csv";
  const response = await fetch(url, {
    method: 'POST'
  });
}

//Main Code
const csvButton = document.getElementsByName("csvExport")[0];
const jsonButton = document.getElementsByName("jsonExport")[0];

csvButton.addEventListener("click", exportToCsv);
jsonButton.addEventListener("click", exportToJson);

fetchQuestionnaire();