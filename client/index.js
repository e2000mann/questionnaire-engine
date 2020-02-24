//up887818
'use strict';

//functions
async function fetchQuestionnaire() {
  let url = "/q?name=example-questionnaire";

  let response = await fetch(url);
  const questionnaire = await response.json();

  let myh1 = document.createElement("h1");
  myh1.textContent = questionnaire.name;
  document.body.prepend(myh1);

  for (const question of questionnaire.questions) {
    let questionElement = document.createElement("section");
    questionElement.id = question.id;
    questionElement.classList.add(question.type);
    question.required === "true" ? questionElement.classList.add("required");
    document.body.insertBefore(questionElement, csvButton);

    let questionTitle = document.createElement("h2");
    questionTitle.textContent = question.text;
    questionElement.appendChild(questionTitle);

    if (question.type.includes("image")) {
      let imageFolder = question.images;

      for (const option of question.options) {
        let template = document.querySelector("#image-checkbox");
        let clone = template.content.cloneNode(true);
        let image = clone.querySelectorAll("img")[0];
        image.title = option;
        image.alt = option;
        image.src = `.\\${imageFolder}\\${option}.png`;
        questionElement.appendChild(clone);
      }
    } else {
      question.type.includes("select") ? await makeSelection(question, questionElement) : makeTextbox(question, questionElement);
    }
  }
}

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

async function exportToJson() {
  let object = makeObjectFromQuestionnaire();
  let url = "/q?name=example-questionnaire&type=json";
  const response = await fetch(url, {
    method: 'POST'
  });
}

async function exportToCsv() {
  let url = "/q?name=example-questionnaire&type=csv";
  const response = await fetch(url, {
    method: 'POST'
  });
}

function makeSelection(question, element) {
  let select = document.createElement("select");
  select.multiple = question.type.includes("multi") ? true : false;
  element.appendChild(select);
  for (const option of question.options) {
    let optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.text = option;
    select.appendChild(optionElement);
  }
}

function makeTextbox(question, element) {
  let questionInput = document.createElement("input");
  questionInput.type = question.type;
  questionInput.value = localStorage.getItem(element.id, questionInput.value);
  element.appendChild(questionInput);
  questionInput.addEventListener("change", function() {
    localStorage.setItem(element.id, questionInput.value)
  });
}

//Main Code
const csvButton = document.getElementsByName("csvExport")[0];
const jsonButton = document.getElementsByName("jsonExport")[0];

csvButton.addEventListener("click", exportToCsv);

jsonButton.addEventListener("click", exportToJson);

fetchQuestionnaire();