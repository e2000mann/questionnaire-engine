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

// this function is the same as the "noneSelected" function in htmlgenerator.js
function checkBoxAnswers(section) {
  const options = section.getElementsByTagName("label");
  let selected = [];
  for (const option of options) {
    if (option.classList.contains("selected")) {
      const value = option.getElementsByTagName("p")[0];
      selected.push(value.textContent);
    }
  }
  return selected;
}



function textOrNumber(q) {
  return q.classList.contains("text") || q.classList.contains("number");
}

function checkIfRequiredComplete() {
  // finds questions which have required in classlist
  const requiredQuestions = document.querySelectorAll('[class$="required"]');

  for (const question of requiredQuestions) {
    // text/number questions
    if (textOrNumber(question)) {
      let inputBox = question.querySelector("input");
      if (inputBox.value == "") {
        window.alert("This question is required");
        question.focus();
        return false;
      }
    } // check boxes
    else {
      if (checkBoxAnswers(question).length == 0) {
        window.alert("This question is required");
        question.focus();
        return false;
      }
    }
  }
  // if hasn't returned yet all required questions are filled
  return true;
}

function getAnswers() {
  const questions = document.getElementsByTagName("section");
  let answers = [];

  for (const question of questions) {
    let answer = {};
    answer.id = question.id;

    if (textOrNumber(question)) {
      let inputBox = question.querySelector("input");
      answer.answer = inputBox.value;
    } else {
      let selected = checkBoxAnswers(question);
      answer.answer = selected;
    }
    answers.push(answer);
  }

  return answers;
}

async function submit() {
  const complete = checkIfRequiredComplete();
  if (complete) {
    const answers = {
      answers: getAnswers()
    };
    console.log(JSON.stringify(answers));

    const title = document.getElementsByTagName("h1")[0].textContent;

    let url = `/submit?q=${title}&answers=${JSON.stringify(answers)}`;
    let response = await fetch(url);
    if (response.ok) {
      window.alert("Thanks for your participation!");
    } else {
      window.alert("There has been an error. Please try again later.");
    }
  }
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

  const submitButton = buttons[0];
  const shareButton = buttons[1];

  //initialise APIs
  initFB();

  //setting button actions
  submitButton.addEventListener("click", submit);
  shareButton.addEventListener("click", shareFB);

  //load questionnaire html
  fetchQuestionnaire();
}

window.addEventListener("load", loadFunct);