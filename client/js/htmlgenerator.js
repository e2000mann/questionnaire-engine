//up887818
'use strict';

// seperate js file accessed using export/import
// this is because these functions are required in both load.js and create.js

export function createSection(q) {

  let csvButton = document.getElementsByName("csvExport")[0];
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