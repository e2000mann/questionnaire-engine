'use strict';

async function checkQuestionnaireExists(name) {
  localStorage.setItem("questionnaire-name", name);
  // Default value - assume questionnaire does not exist.
  // Otherwise this will cause errors in later code.
  let exists = "false";
  if (!(name === "")) {
    let response = await fetch(`/check?name=${name}`);
    exists = await response.text();
  }

  //Converts string output to bool
  const existsBool = (exists === "true");

  return existsBool;
}

function loadQuestionnaire() {
  //Prompt user to give input
  const userInput = window.prompt("Type in the name of the questionnaire:");

  // userInput = null means they cancelled prompt. No point in checking further
  if (userInput !== null) {
    // Returns bool value
    const existsBool = checkQuestionnaireExists(userInput);
    if (existsBool) {
      //checkQuestionnaireExists adds userInput to localStorage. This will
      //be used to access the correct questionnaire. Just redirect to load page.
      window.location.href = "../load.html";
    } else {
      //User has typed invalid questionnaire name.
      const errorBox = document.querySelector("#errorBox");
      errorBox.textContent = "That Questionnaire does not exist.";
    }
  }
}

function addButtons() {
  // Getting all buttons in an array
  const buttons = document.getElementsByTagName("button");

  //Button 0 - "Create/Edit Questionnaire"
  buttons[0].addEventListener("click", function() {
    window.location.href = "../login.html"
  });

  //Button 1 - "Load Questionnaire"
  buttons[1].addEventListener("click", loadQuestionnaire);
}

window.addEventListener("load", addButtons);