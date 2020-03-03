//up887818
'use strict';

// const htmlGenerator = require("./htmlgenerator");

//functions
async function fetchQuestionnaire() {
  let name = localStorage.getItem("questionnaire-name");

  let url = `/q?name=${name}`;

  let response = await fetch(url);
  const questionnaire = await response.json();

  let myh1 = document.createElement("h1");
  myh1.textContent = questionnaire.name;
  document.body.prepend(myh1);

  questionnaire.questions.forEach(createSection);
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

// htmlgenerator.js - remove when u figure out how to require modules here
function createSection(q) {
  let qElement = document.createElement("section");
  qElement.id = q.id;
  qElement.classList.add(q.type);
  document.body.insertBefore(qElement, csvButton);

  let qTitle = document.createElement("h2");
  qTitle.textContent = q.text;
  qElement.prepend(qTitle);

  if (q.required === "true") {
    indicateRequired(qElement);
  }

  createInput(q, qElement);
}


function createInput(q, element) {
  if (q.type.includes("image")) {
    loadImageQuestion(q, element);
  } else {
    if (q.type.includes("select")) {
      makeSelection(q, element);
    } else {
      makeTextbox(q, element);
    }
  }
}


function indicateRequired(element) {
  element.classList.add("required");
  let indicator = document.createElement("p");
  indicator.textContent = "*";
  element.prepend(indicator);
}

function makeSelection(question, element) {
  let div = document.createElement("div");
  let template = document.querySelector("#text-checkbox");

  for (const option of question.options) {
    let clone = template.content.cloneNode(true);
    let textbox = clone.querySelectorAll("p")[0];
    textbox.textContent = option;
    div.appendChild(clone);
  }
  element.appendChild(div);
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


function loadImageQuestion(question, element) {
  let imageFolder = `questionnaires/${question.images}`;
  let template = document.querySelector("#image-checkbox");

  for (const option of question.options) {
    let clone = template.content.cloneNode(true);
    let image = clone.querySelectorAll("img")[0];
    image.title = option;
    image.alt = option;
    image.src = `.\\${imageFolder}\\${option}.png`;
    let checkBox = clone.querySelectorAll("input")[0];
    checkBox.addEventListener("click", toggleSelected);
    element.appendChild(clone);
  }
}

function toggleSelected(event) {
  let element = event.target.parentElement;
  if (!element.classList.contains("selected")) {
    element.classList.add("selected");
  } else {
    element.classList.remove("selected");
  }
}

//Main Code
const csvButton = document.getElementsByName("csvExport")[0];
const jsonButton = document.getElementsByName("jsonExport")[0];

csvButton.addEventListener("click", exportToCsv);
jsonButton.addEventListener("click", exportToJson);

fetchQuestionnaire();