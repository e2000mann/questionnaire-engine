//up887818
'use strict';

//functions
function makeObjectFromQuestionnaire() {
  let object = {};

  object.name = document.getElementsByTagName("h1")[0];

  console.log(object);
  return object;
}

function exportToJson() {
  let object = makeObjectFromQuestionnaire();
}

function makeCheckboxes(question, element) {
  const imageCheckboxes = question.type.includes("image");
  for (const option in question.options) {
    let optionName = question.options[option];
    if (imageCheckboxes) {
      let template = document.querySelector("#image-checkbox");
      let clone = template.content.cloneNode(true);
      let image = clone.querySelectorAll("img")[0];
      image.src = `${question.id}\\${optionName}.png`;
      image.alt = optionName;
      image.title = optionName;
      element.appendChild(clone);
    } else {
      let template = document.querySelector("#text-checkbox");
      let clone = template.content.cloneNode(true);
      let label = clone.querySelectorAll("label")[0];
      label.textContent = optionName;
      element.appendChild(clone);
    }
  }
}

function makeTextbox(question, element) {
  let questionInput = document.createElement("input");
  questionInput.type = question.type;
  element.appendChild(questionInput);
}

//Main Code
const csvButton = document.getElementsByName("csvExport")[0];
const jsonButton = document.getElementsByName("jsonExport")[0];

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
  document.body.insertBefore(myh1, csvButton);

  for (const question of questionnaire.questions) {
    let questionElement = document.createElement("section");
    questionElement.id = question.id;
    questionElement.classList.add(question.type);
    document.body.insertBefore(questionElement, csvButton);

    let questionTitle = document.createElement("h2");
    questionTitle.textContent = question.text;
    questionElement.appendChild(questionTitle);

    question.type.includes("select") ? makeCheckboxes(question, questionElement) : makeTextbox(question, questionElement);
  }
}

csvButton.addEventListener("click", function() {
  console.log("Hello")
});

jsonButton.onClick = exportToJson();