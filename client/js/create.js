//up887818
'use strict';

// imports createSection function from htmlgenerator.js
import {
  createSection,
  fetchQuestionnaire
} from './htmlgenerator.js';

// functions

function edit() {
  const uploadButton = document.getElementsByName("submit")[0];
  uploadButton.addEventListener("click", upload(true));


}

function create() {
  // show options only needed for creating questionnaire
  const hidden = document.querySelector("#hideByDefault");
  hidden.style.display = 'inline';

  const uploadButton = document.getElementsByName("submit")[0];
  uploadButton.addEventListener("click", upload(false));
}

function createQuestionInput() {
  console.log("add question");
  let buttons = document.querySelector(".buttons");
  let template = document.querySelector("#question-form");
  let clone = template.content.cloneNode(true);
  document.body.insertBefore(clone, buttons);
}

async function upload(edit) {
  // get questions first
  const data = {};
  // if creating questionnaire
  if (!edit) {
    // uuid generated in server.js
    const email = sessionStorage.getItem("user-email");
    const exportOption = document.querySelector("#exportOption");
    const json = exportOption.selected;
    // selected = json, unselected = csv
    const url = `/create?data=${data}&email=${email}&json=${json}`;
  } else {
    const url = `/edit?data=${data}`;
  }
  let response = await fetch(url);
}

// Main Code
window.onload = function() {
  const addQuestion = document.getElementsByName("addQuestion")[0];

  addQuestion.addEventListener("click", createQuestionInput);

  // using sessionStorage instead of localStorage to reduce amount of data
  // left when session ended
  // json parse turns strings into bool value
  JSON.parse(sessionStorage.getItem("edit-mode")) ? edit() : create();
};