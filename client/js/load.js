//up887818
'use strict';

// imports FB initialisation code from apicode.js
// (no need for google api)
import {
  initFB
} from './apicode.js';

// imports createSection function from htmlgenerator.js
import {
  fetchQuestionnaire
} from './htmlgenerator.js';

//functions
// async function fetchQuestionnaire() {
//   let name = localStorage.getItem("questionnaire-name");
//
//   let url = `/q?name=${name}`;
//
//   let response = await fetch(url);
//   const questionnaire = await response.json();
//
//   let myh1 = document.createElement("h1");
//   myh1.textContent = questionnaire.name;
//   document.body.prepend(myh1);
//
//   questionnaire.questions.forEach(createSection);
// }

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



function shareFB() {
  let questionnaireName = document.getElementsByTagName("h1")[0];
  let url = window.location.href;

  FB.ui({
    method: 'share',
    href: url,
    quote: `${findRandomQuestion} Answer this and more in this questionnaire!`
  }, function(response) {});
}

//Code to Run when page loads
function loadFunct() {
  //buttons
  const buttons = document.getElementsByTagName("button");

  const csvButton = buttons[0];
  const jsonButton = buttons[1];
  const shareButton = buttons[2];

  //initialise APIs
  initFB();

  //setting button actions
  csvButton.addEventListener("click", exportToCsv);
  jsonButton.addEventListener("click", exportToJson);
  shareButton.addEventListener("click", shareFB);

  //load questionnaire html
  fetchQuestionnaire();
}

window.addEventListener("load", loadFunct);