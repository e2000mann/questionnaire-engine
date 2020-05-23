# up887818 Web Programming CW - Questionnaire Engine

## Features
- Login using Google (OAuth)
- Being logged in allows for the following:
  - Creating questionnaires through JSON or GUI
  - Editing previously made questionnaires
  - Exporting questionnaire answers as either a CSV or JSON file
- Features all users can use:
  - Answer questionnaire
  - Share questionnaire on Facebook*
  - Share questionnaire on Twitter
- Support for the following types of questions:
  - Text "text"
  - Number "number"
  - Select
    - Single Select "single-select"
    - Multi Select "multi-select"
    - Single Image Select "single-select-image"
    - Multi Image Select "multi-select-image"
  - Likert Scale
    - Numbers (1->5) "likert-scale-numbers"
    - Very Satisfied -> Very Unsatisfied "likert-scale-values"

## How it works
- Database using PSQL (npm run setup)
- Server using node.js & express (npm server)
- Automated testing using QUnit (npm test)

*Feature not completely available because of COVID :(
