async function uniqueName(name) {
  // giving each questionnaire a unique name keeps my load function working :)
  let validname = false;
  let attempts = 0;
  let testName = "";
  
  while (!validName) {
    // e.g. If someone tries to make a questionnaire named "Example Questionnaire"
    // it would instead be called "Example Questionnaire0"
    attempts == 0 ? testname = name + attempts : testname = name;
    let response = await fetch(`/check?name=${name}`);
    if (response.ok) {
      let result = response.text();
      if (result == "") {
        validname = true;
      } else {
        attempts++;
      }
    }
    
  return testName;
