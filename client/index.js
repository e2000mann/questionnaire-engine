//up887818
'use strict';

//functions
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
      let answer = question.getElementsByTagName("input")[0];
      info.answers = answer.value;
    }

    object.questions.push(info);
  }

  console.log(object);
  return object;
}

function findCheckedBoxes(q) {
  return;
}

function exportToJson() {
  let object = makeObjectFromQuestionnaire();
}

function makeCheckboxes(question, element) {
  const imageCheckboxes = question.type.includes("image");
  if (imageCheckboxes) {
    for (const option of question.options) {
      let template = document.querySelector("#image-checkbox");
      let clone = template.content.cloneNode(true);
      let image = clone.querySelectorAll("img")[0];
      image.title = option;
      image.alt = option;
      image.src = `${question.id}\\${option}.png`;
      element.appendChild(clone);
    }
  } else {
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

fetch('example-questionnaire.json')
  .then(
    function(response) {
      //http status 200 is success code
      if (response.status !== 200) {
        console.log(`Error ${response.status}`);
        return;
      }
      response.json().then(function(questionnaire) {
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
      })
    }
  )

csvButton.addEventListener("click", function() {
  console.log("Hello")
});

jsonButton.addEventListener("click", exportToJson);