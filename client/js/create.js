//up887818
'use strict';

// imports createSection function from htmlgenerator.js
import {
  createSection
} from './htmlgenerator.js';

// functions

function addTitle(name) {
  let myh1 = document.createElement("h1");
  myh1.textContent = name;
  document.body.prepend(myh1);
}

function createQuestionInput() {
  console.log("add question");
  let template = document.querySelector("#question-form");
  let clone = template.content.cloneNode(true);
  let button = clone.childNodes[1].lastChild.previousSibling;
  console.log(button);
  button.addEventListener("click", sayHi);
  document.body.insertBefore(clone, addQuestion);
}

function sayHi() {
  console.log("hi");
}

// Main Code
const name = localStorage.getItem("questionnaire-name");
const addQuestion = document.getElementsByName("addQuestion")[0];

addQuestion.addEventListener("click", createQuestionInput);

addTitle(name);