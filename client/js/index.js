//up887818
'use strict';

async function checkQuestionnaireExists(name) {
  if (name !== "") {
    let response = await fetch(`/check?name=${name}`);
    if (response.ok) {
      const id = await response.text();
      console.log(id);
      if (id != "") {
        localStorage.setItem("questionnaire-id", id);
        sessionStorage.setItem("questionnaire-name", name);
        return true;
      } else {
        return false;
      }
    }
    return false;
  }
}

async function loadQuestionnaire() {
  //Prompt user to give input
  const userInput = window.prompt("Type in the name of the questionnaire:");

  // userInput = null means they cancelled prompt. No point in checking further
  if (userInput !== null) {
    // Returns bool value
    const existsBool = await checkQuestionnaireExists(userInput);
    console.log(existsBool);
    if (existsBool) {
      //checkQuestionnaireExists adds userInput to localStorage. This will
      //be used to access the correct questionnaire. Just redirect to load page.
      window.location.href = "../load.html";
    } else {
      //User has typed invalid questionnaire name.
      window.alert("That questionnaire does not exist");
    }
  }
}

function createQuestionnaire() {
  sessionStorage.setItem("edit-mode", "false");
  window.location.href = "../create.html";
}

async function uploadJson() {
  // first check to see if there is a json file
  const jsonFile = document.querySelector("#jsonFile").files[0];
  const reader = new FileReader();
  reader.readAsText(jsonFile);

  reader.onload = async function(event) {
    const data = reader.result;
    console.log(data);
    // get users response choice
    const template = document.querySelector("#createFromJSON");
    const clone = template.content.cloneNode(true);

    const submitButton = clone.querySelector("submitButton");
    submitButton.addEventListener("click", function() {
      confirmSubmission(data);
    });
  }
}

async function confirmSubmission(data) {
  const userInput = window.prompt("Do you want the responses in CSV or JSON?");
  let jsonChoice = false;

  if (userInput !== null) {
    if (userInput.toLowerCase() == "json") {
      jsonChoice = true;
    }
  }

  // get email
  const email = sessionStorage.getItem("user-email");

  // todo: get this to work with images

  // upload to server & database
  const url = `/create?data=${data}&email=${email}&json=${jsonChoice}`;
  let response = await fetch(url, {
    method: 'POST'
  });
  if (response.ok) {
    window.alert("Thanks for uploading a questionnaire!");
  } else {
    window.alert("There has been an error. Please try again later.");
  }
}
}

function editQuestionnaire() {
  sessionStorage.setItem("edit-mode", "true");

  // should get h3 element
  const nameEle = event.target.parentElement.firstChild;
  const name = nameEle.textContent;

  sessionStorage.setItem("questionnaire-name", name);
}

// login functionality
function onSignIn(googleuser) {
  const profile = googleuser.getBasicProfile();
  const email = profile.getEmail();
  const name = profile.getGivenName();
  loadItems(email, name);
}

async function loadItems(email, name) {
  // add email to sessionstorage
  sessionStorage.setItem("user-email", email);
  // show the items that is only available post-login
  const hidden = document.querySelector("#hideByDefault");
  hidden.style.display = 'inline';

  const textBox = document.querySelector("h2");
  textBox.textContent = `${name}'s Questionnaires`;

  // show questionnaires
  const url = `/getQuestionnaires?email=${email}`;
  let response = await fetch(url);

  if (response.ok) {
    const data = await response.json();
    generateHtml(data);
  }
}

async function download(element, id, ext) {
  const fileName = `responses.${ext}`;
  // fileDir is relative to this file. Using a direct directory fails
  const fileDir = `../questionnaires/${id}/${fileName}`;

  // To reduce initial load on server the download link is not set up until
  // the user requests it.
  // Since fileDir is relative to this file & not the server, this sends the
  // id & filename so that the correct directory is checked on the server side.
  let response = await fetch(`/checkForResponses?id=${id}&filename=${fileName}`);
  if (response.ok) {
    const fileExists = await response.text();
    // is meant to be a boolean
    if (fileExists == "true") {
      element.href = fileDir;
      element.download = fileName;

      element.click();
    } else {
      window.alert("You have not yet had any responses.");
    }
  }
}

function viewResults(id, ext) {
  sessionStorage.setItem("questionnaire-id", id);
  sessionStorage.setItem("questionnaire-ext", ext);
  window.location.href = "../results.html";
}

async function generateHtml(data) {
  const apiCode = import('./apicode.js');
  const destination = document.querySelector("#hideByDefault");
  const template = document.querySelector("#questionnaire");

  for (const questionnaire of data) {
    // copy template
    let clone = template.content.cloneNode(true);
    // write name
    let nameBox = clone.querySelectorAll("h3")[0];
    nameBox.textContent = questionnaire.name;
    // get buttons
    const buttons = clone.querySelectorAll("button");
    // button 0 is the edit button
    const dlButton = buttons[1];
    const responseButton = buttons[2];
    const fbButton = buttons[3];
    const twButton = clone.querySelector(".twitter-share-button");
    // set buttons based on response file extension
    if (questionnaire.json) {
      dlButton.addEventListener("click", function() {
        const a = event.target.parentElement.getElementsByTagName("a")[0];
        download(a, questionnaire.id, "json");
      });
      responseButton.addEventListener("click", function() {
        viewResults(questionnaire.id, "json");
      });
    } else {
      dlButton.addEventListener("click", function() {
        const a = event.target.parentElement.getElementsByTagName("a")[0];
        console.log(a);
        download(a, questionnaire.id, "csv");
      });
      responseButton.addEventListener("click", function() {
        viewResults(questionnaire.id, "csv");
      });
    }
    // add share functionality
    import('./apicode.js')
      .then(module => {
        module.shareButtons(questionnaire.name, fbButton, twButton);
      });
    // destination.children[1] gets 2nd child
    destination.insertBefore(clone, destination.children[1]);
  }
}

window.addEventListener("load", function() {
  // note: dynamic importing is being used because typing type="module" in
  // the html script tag broke oauth.
  import('./apicode.js')
    .then(module => {
      module.initFB();
    });

  const jsonUpload = document.querySelector("#jsonFile");
  jsonUpload.addEventListener("change", uploadJson);
});