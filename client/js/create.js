//up887818
'use strict';

// functions
function edit(uploadButton) {
  uploadButton.addEventListener("click", upload(true));
}

function create(uploadButton) {
  // show options only needed for creating questionnaire
  const hidden = document.querySelector("#hideByDefault");
  hidden.style.display = 'inline';

  uploadButton.addEventListener("click", upload(false));
}

function createQuestionInput() {
  console.log("add question");
  // show question options
  const options = document.querySelector(".questionOptionsHidden");
  options.classList.replace("questionOptionsHidden", "questionOptions");
}

async function getUuid() {
  let response = await fetch(`/uuid`);
  if (response.ok) {
    return response.text();
  }
}

function getData() {
  let data = {};
  data.name = document.querySelector("#name").textContent;
  data.questions = [];

  const questions = document.querySelector(".questions").querySelectorAll("section");
  for (const question of questions) {
    let output = {};
    output.id = question.querySelector(".id").value;
    output.type = question.id;
    output.text = question.querySelector(".text").value;
    output.required = question.querySelector(".required").checked.toString();
    if (question.id.includes("select")) {
      output.options = [];
      if (question.id.includes("image")) {
        console.log("image");
      } else {
        const options = question.getElementsByTagName("div");
        for (const option of options) {
          const input = option.querySelector("input");
          output.options.append(input.value);
        }
      }
    }
    data.questions.append(output);
  }
}

async function upload(edit) {
  // get questions first
  const data = {};
  let url = '';
  // if creating questionnaire
  if (!edit) {
    const id = await getUuid();
    const email = sessionStorage.getItem("user-email");
    const jsonChoice = document.querySelector('input[name="jsonCheck"]:checked').value;

    const data = getData();

    url = `/create?id=${id}&email=${email}&json=${json}`;
  }
  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: data
  });
  if (response.ok) {
    window.alert(`Your questionnaire ${await response.text()} has been uploaded.`);
  } else {
    window.alert("There has been an error. Please try again later.");
  }
}

function showQuestion(id) {
  let template;
  if (!id.includes("select")) {
    template = document.querySelector("#basic");
  } else if (id.includes("image")) {
    template = document.querySelector("#imageUpload");
  } else {
    template = document.querySelector("#checkbox");
  }
  const clone = template.content.cloneNode(true);
  clone.querySelector("section").classList.add(id);

  const dest = document.querySelector(".questions");
  dest.appendChild(clone);
}

function addOption(event) {
  const template = document.querySelector("#checkboxOption");
  const dest = event.target.parentElement;
  const clone = template.content.cloneNode(true);
  dest.insertBefore(clone, event.target);
}

function deleteQ(event) {
  const target = event.target.parentElement;
  target.remove();
}

// Main Code
window.onload = function() {
  const buttons = document.querySelector(".buttons").children;
  console.log(buttons);
  // button 0 - add question button
  buttons[0].addEventListener("click", createQuestionInput);

  // button 1 - upload button
  // using sessionStorage instead of localStorage to reduce amount of data
  // left when session ended
  // json parse turns strings into bool value
  JSON.parse(sessionStorage.getItem("edit-mode")) ? edit(buttons[1]) : create(buttons[1]);

  const imageButtons = document.getElementsByTagName("picture");

  for (const imageButton of imageButtons) {
    imageButton.addEventListener("click", function() {
      showQuestion(event.target.parentElement.id);
      // hide questionOptions
      const options = document.querySelector(".questionOptions");
      options.classList.replace("questionOptions", "questionOptionsHidden");
    });
  }

};