//up887818
'use strict';

// seperate js file accessed using export/import
// this is because these functions are required in both load.js and create.js

export function createSection(q) {
  const buttons = document.querySelector(".buttons");
  const qElement = document.createElement("section");
  qElement.id = q.id;
  qElement.classList.add(q.type);
  document.body.insertBefore(qElement, buttons);

  const qTitle = document.createElement("h2");
  qTitle.textContent = q.text;
  qElement.prepend(qTitle);

  if (q.required === "true") {
    indicateRequired(qElement);
  }

  createInput(q, qElement);
}


function createInput(q, element) {
  if (q.type.includes("select")) {
    if (q.type.includes("image")) {
      loadImageQuestion(q, element);
    } else {
      makeSelection(q, element);
    }
  } else {
    if (q.type.includes("likert-scale")) {
      createLikertScale(q, element);
    } else {
      makeTextbox(q, element)
    }
  }
}


function indicateRequired(element) {
  element.classList.add("required");
  const indicator = document.createElement("p");
  indicator.textContent = "*";
  element.prepend(indicator);
}

function makeSelection(question, element) {
  const template = document.querySelector("#text-checkbox");

  for (const option of question.options) {
    let clone = template.content.cloneNode(true);
    let textbox = clone.querySelectorAll("p")[0];
    textbox.textContent = option;
    if (question.type.includes("single")) {
      let checkBox = clone.querySelectorAll("input")[0];
      checkBox.addEventListener("click", toggleSelected);
    }
    element.appendChild(clone);
  }
}

function createLikertScale(question, element) {
  const template = document.querySelector("#likert-scale");

  let clone = template.content.cloneNode(true);

  let labels = clone.firstElementChild.getElementsByTagName("label");

  if (question.type.includes("numbers")) {
    // numbers
    fillLabelValues(labels, [1, 2, 3, 4, 5]);
  } else if (question.type.includes("values")) {
    // values
    fillLabelValues(labels, ["Very Unsatisfied",
      "Unsatisfied",
      "Neutral",
      "Satisfied",
      "Very Satisfied"
    ]);
  } else {
    // emojis
    fillLabelValues(labels, ["😭", "😪", "😐", "🙂", "😁"]);
  }

  element.appendChild(clone);
}

function fillLabelValues(labels, values) {
  for (let i = 0; i <= 4; i++) {
    let textBox = document.createElement("p");
    textBox.textContent = values[i];
    labels[i].prepend(textBox);

    let checkBox = labels[i].querySelectorAll("input")[0];
    checkBox.addEventListener("click", toggleSelected);
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


function loadImageQuestion(question, element) {
  const id = localStorage.getItem("questionnaire-id");
  const imageFolder = `questionnaires/${id}/${question.id}`;
  const template = document.querySelector("#image-checkbox");

  for (const option of question.options) {
    const clone = template.content.cloneNode(true);
    const image = clone.querySelectorAll("img")[0];
    image.title = option;
    image.alt = option;
    addImageSrc(image, imageFolder, option);
    if (question.type.includes("single")) {
      let checkBox = clone.querySelectorAll("input")[0];
      checkBox.addEventListener("click", toggleSelected);
    }
    element.appendChild(clone);
  }
}

function addImageSrc(imgEl, imageFolder, fileName) {
  // this function allows the engine to work with multiple file extensions.
  imgEl.src = `.\\${imageFolder}\\${fileName}.png`;
  imgEl.onerror = () => {
    imgEl.src = `.\\${imageFolder}\\${fileName}.jpg`;
    imgEl.onerror = () => {
      imgEl.src = `.\\${imageFolder}\\${fileName}.jpg`
      imgEl.onerror = () => {
        // if none of the file extensions work, change img into text
        const textEl = document.createElement("p");
        textEl.textContent = fileName;
        imgEl.parentNode.replaceChild(textEl, imgEl);
      }
    }
  }
}

function toggleSelected(event) {
  console.log("checking");
  let targetEle = event.target.parentElement;
  let targetParent = targetEle.parentElement;
  if (!targetEle.classList.contains("selected")) {
    if (noneSelected(targetParent)) {
      targetEle.classList.add("selected");
    } else {
      let selectedEle = targetParent.querySelector(".selected");
      selectedEle.classList.remove("selected");
      targetEle.classList.add("selected");
    }
  } else {
    targetEle.classList.remove("selected");
  }

  if (!targetParent.classList.contains("image")) {
    correctCheckboxes(targetParent);
  }
}

function noneSelected(section) {
  let options = section.getElementsByTagName("label");
  for (const option of options) {
    if (option.classList.contains("selected")) {
      return false;
    }
  }
  return true;
}

// unchecking the boxes using javascript does not update it visually unless
// this function is called
function correctCheckboxes(section) {
  let options = section.getElementsByTagName("label");
  for (const option of options) {
    let optionCheckbox = option.firstElementChild;
    optionCheckbox.checked = option.classList.contains("selected");
  }
}

export async function fetchQuestionnaire() {
  const id = localStorage.getItem("questionnaire-id");
  console.log(id);

  const url = `/load?id=${id}`;

  let response = await fetch(url);
  const questionnaire = await response.json();

  let myh1 = document.createElement("h1");
  myh1.textContent = questionnaire.name;
  document.body.prepend(myh1);

  questionnaire.questions.forEach(createSection);
}