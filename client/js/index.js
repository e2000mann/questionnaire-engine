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

// login functionality
function fbLogin(response) {
  if (response.status === 'connected') {
    loadItems(email);
  }
}

function onSignIn(googleuser) {
  const profile = googleuser.getBasicProfile();
  const email = profile.getEmail();
  loadItems(email);
}

async function edit() {
  return;
}

async function loadItems(email) {
  // add email to sessionstorage
  sessionStorage.setItem("user-email", email);
  // show the items that is only available post-login
  const hidden = document.querySelector(".hideByDefault");
  hidden.style.display = 'inline';

  // show questionnaires
  const url = `/getQuestionnaires?email=${email}`;
  let response = await fetch(url);

  if (response.ok) {
    const data = await response.json();
    generateHtml(data);
  };
}

async function generateHtml(data) {
  const destination = document.querySelector(".hideByDefault");
  const template = document.querySelector("#questionnaire");

  for (const questionnaire of data) {
    // copy template
    let clone = template.content.cloneNode(true);
    console.log(clone);
    // write name
    let nameBox = clone.querySelectorAll("h3")[0];
    nameBox.textContent = questionnaire.name;
    // get buttons
    let buttons = clone.querySelectorAll("button");
    buttons[0].addEventListener("click", edit);
    // get download link
    if (questionnaire.json) {
      buttons[1].addEventListener("click", function() {
        window.open(`/client/questionnaires/${questionnaire.name}/responses.json`);
      });
    } else {
      buttons[1].addEventListener("click", function() {
        window.open(`/client/questionnaires/${questionnaire.name}/responses.csv`);
      });
    }
    // destination.children[1] gets 2nd child
    destination.insertBefore(clone, destination.children[1]);
  };
}