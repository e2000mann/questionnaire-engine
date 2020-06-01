//up887818
'use strict';

// functions
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

  const nameEl = document.querySelector("#name");
  const name = nameEl.value;

  if (name == "") {
    window.alert("Make sure to name your questionnaire!");
    return;
  } else {
    let data = {
      name: name,
      questions: []
    };

    const questions = document.querySelector(".questions").querySelectorAll("section");
    for (const question of questions) {
      let output = {
        id: question.querySelector(".id").value,
        type: question.id,
        text: question.querySelector(".text").value,
        required: question.querySelector(".required").checked.toString()
      };
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
      data.questions.push(output);
    }
  }

}

async function upload() {
  const data = getData();

  if (data != null) {
    // no need in getting the other bits of information needed,
    // if there is no data to send
    const id = await getUuid();
    const email = sessionStorage.getItem("user-email");
    const jsonChoice = document.querySelector('input[name="jsonCheck"]:checked').value;

    const url = `/create?id=${id}&email=${email}&json=${jsonChoice}`;
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
  const buttons = document.getElementsByTagName("button");

  // button 0 - add question button
  buttons[0].addEventListener("click", createQuestionInput);
  // button 1 - upload button
  buttons[1].addEventListener("click", upload);

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