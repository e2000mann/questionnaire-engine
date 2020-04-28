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
  // show the items that is only available post-login
  const loginOnly = document.querySelector(".loginOnly");
  loginOnly.hidden = false;

  // show questionnaires
  const url = `/getQuestionnaires?email=${email}`;
  let response = await fetch(url);
}