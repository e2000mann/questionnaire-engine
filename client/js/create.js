//up887818
'use strict';

// imports createSection function from htmlgenerator.js
import {
  createSection,
  fetchQuestionnaire
} from './htmlgenerator.js';

// functions

function addTitle(name) {
  let myh1 = document.createElement("h1");
  myh1.textContent = name;
  document.body.prepend(myh1);
}

function createQuestionInput() {
  console.log("add question");
  let buttons = document.querySelector(".buttons");
  let template = document.querySelector("#question-form");
  let clone = template.content.cloneNode(true);
  let button = clone.childNodes[1].lastChild.previousSibling;
  console.log(button);
  button.addEventListener("click", sayHi);
  document.body.insertBefore(clone, buttons);
}

function sayHi() {
  console.log("hi");
}

function upload() {
  const email = sessionStorage.getItem("user-email");
  const uuid =
    // get questions first

    // then load into database
    const exportOption = document.querySelector("#exportOption");
  // selected = json, unselected = csv
  return;
}

// Main Code
const name = localStorage.getItem("questionnaire-name");
const addQuestion = document.getElementsByName("addQuestion")[0];

addQuestion.addEventListener("click", createQuestionInput);

localStorage.getItem("edit-mode") ? fetchQuestionnaire() : addTitle(name);