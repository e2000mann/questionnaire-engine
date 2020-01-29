//up887818
'use strict';

//functions
function makeCheckboxes(question, element) {
  for (const option in question.options) {
    let div = document.createElement("div");
    element.appendChild(div);
    let checkBox = document.createElement("input");
    checkBox.type = "checkBox";
    div.appendChild(checkBox);
    let label = document.createElement("label");
    div.appendChild(label);
    label.textContent = question.options[option];
    div.appendChild(label);
  }
}

function makeTextbox(question, element) {
  let questionInput = document.createElement("input");
  questionInput.type = question.type;
  element.appendChild(questionInput);
}

// Open a request to get json file
let requestURL = 'example-questionnaire.json';
let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();

request.onload = function() {
  // creates js object
  const questionnaire = request.response;
  let myh1 = document.createElement("h1");
  myh1.textContent = questionnaire.name;
  document.body.appendChild(myh1);

  for (const question of questionnaire.questions) {
    let questionElement = document.createElement("section");
    questionElement.id = question.id;
    questionElement.classList.add(question.type);
    document.body.appendChild(questionElement);

    let questionTitle = document.createElement("h2");
    questionTitle.textContent = question.text;
    questionElement.appendChild(questionTitle);

    question.type.includes("select") ? makeCheckboxes(question, questionElement) : makeTextbox(question, questionElement);
  }
}