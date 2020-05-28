//up887818
'use strict';

// imports createSection function from htmlgenerator.js
import {
  createSection,
  fetchQuestionnaire
} from './htmlgenerator.js';

// imports uniqueName function
import {
  uniqueName
} from './uniqueName.js';

// functions

function edit(uploadButton) {
  uploadButton.addEventListener("click", upload(true));
}

function create(uploadButton) {
  // show options only needed for creating questionnaire
  const hidden = document.querySelector("#hideByDefault");
  hidden.style.display = 'inline';

  uploadButton.addEventListener("click", upload(false));
}

function createQuestionInput() {
  console.log("add question");
  // show question options
  const options = document.querySelector(".questionOptionsHidden");
  options.classList.replace("questionOptionsHidden", "questionOptions");
}

async function upload(edit) {
  // get questions first
  const data = {};
  let url = '';
  // if creating questionnaire
  if (!edit) {
    // uuid generated in server.js
    const email = sessionStorage.getItem("user-email");
    const exportOption = document.querySelector("#exportOption");
    const json = exportOption.selected;
    // selected = json, unselected = csv
    url = `/create?data=${data}&email=${email}&json=${json}`;
  } else {
    url = `/edit?data=${data}`;
  }
  let response = await fetch(url);
}

// Main Code
window.onload = function() {
  const buttons = document.querySelector(".buttons").children;
  console.log(buttons);
  // button 0 - add question button
  buttons[0].addEventListener("click", createQuestionInput);

  // button 1 - upload button
  // using sessionStorage instead of localStorage to reduce amount of data
  // left when session ended
  // json parse turns strings into bool value
  JSON.parse(sessionStorage.getItem("edit-mode")) ? edit(buttons[1]) : create(buttons[1]);

  const imageButtons = document.getElementsByTagName("picture");

  for (const imageButton of imageButtons) {
    imageButton.addEventListener("click", function() {
      console.log(event.target.parentElement.id);
      // hide questionOptions
      const options = document.querySelector(".questionOptions");
      options.classList.replace("questionOptions", "questionOptionsHidden");
    });
  }

};