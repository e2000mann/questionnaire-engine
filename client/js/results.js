//up887818
'use strict';

function goBack() {
  window.location.href = "../index.html";
}

function getResults() {
  const id = sessionStorage.getItem("questionnaire-id");
  const ext = sessionStorage.getItem("questionnaire-ext");

  const questionnaireLoc = `client/questionnaires/${id}/${id}.json`;
  const resultsLoc = `client/questionnaires/${id}/responses.${ext}`;
}

window.onload = getResults();