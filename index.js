'use strict';

// Open a request to get json file
let requestURL = 'example-questionnaire.json';
let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();

request.onload = function() {
  // creates js object
  const questionnaire = request.response;
  let myh1 = document.createElement("h1");
  myh1.textContent = questionnaire.name;
  document.body.appendChild(myh1);
}