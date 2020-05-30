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
    const answers = getAnswers();
    console.log(answers);

    const id = localStorage.getItem("questionnaire-id");

    let url = `/submit?id=${id}&answers=${JSON.stringify(answers)}`;
    let response = await fetch(url, {
      method: 'POST'
    });
    if (response.ok) {
      window.alert("Thanks for your participation!");
    } else {
      window.alert("There has been an error. Please try again later.");
    }
  }
}

function shareFB(quote) {
  let questionnaireName = document.getElementsByTagName("h1")[0];
  let url = window.location.href;

  FB.ui({
    method: 'share',
    href: url,
    quote: quote
  }, function(response) {});
}

//Code to Run when page loads
function loadFunct() {
  //initialise facebook API
  initFB();

  //buttons
  const buttons = document.getElementsByTagName("button");

  const submitButton = buttons[0];
  const fbButton = buttons[1];

  let name = sessionStorage.getItem("questionnaire-name");
  console.log(name);
  console.log(sessionStorage);
  const shareQuote = `Have you answered ${name} yet? Do so with this questionnaire engine!`;

  //setting button actions
  submitButton.addEventListener("click", submit);
  fbButton.addEventListener("click", function() {
    shareFB(shareQuote);
  });

  const twButton = document.querySelector(".twitter-share-button");
  twButton.href = `https://twitter.com/intent/tweet?text=${shareQuote}`;

  //load questionnaire html
  fetchQuestionnaire();
}

window.addEventListener("load", loadFunct);