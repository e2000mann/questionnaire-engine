'use strict';

function fbLogin(response) {
  if (response.status === 'connected') {
    loadItems(email);
  }
}

function onSignIn(googleuser) {
  const profile = googleuser.getBasicProfile();
  const email = profile.getEmail();
  loadItems(email);
}

async function loadItems(email) {
  // add email to sessionstorage
  sessionStorage.setItem("user-email", email);
  // show the items that is only available post-login
  const hidden = document.querySelector("#hideByDefault");
  hidden.style.display = 'inline';

  // show questionnaires
  const url = `/getQuestionnaires?email=${email}`;
  let response = await fetch(url);

  const template = document.querySelector("#questionnaire");

  for (const questionnaire of response) {
    let clone = template.content.cloneNode(true);
    let nameBox = clone.getElementsByTagName("p")[0];
    nameBox.textContent = questionnaire.name;
  }
}