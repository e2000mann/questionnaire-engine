# up887818 Web Programming CW - Questionnaire Engine
Version: 0

## Features
- Login using Google (OAuth)
- Being logged in allows for the following:
  - Creating questionnaires
  - Editing previously made questionnaires
  - Exporting questionnaire answers as either a CSV or JSON file
- Features all users can use:
  - Answer questionnaire
  - Share questionnaire on Facebook*
  - Share questionnaire on Twitter
- Support for the following types of questions:
  - Text
  - Number
  - Single Select
  - Multi Select
  - Image Select
  - Likert Scale

## How it works
- Database using PSQL (npm run setup)
- Server using node.js & express (npm server)
- Automated testing using QUnit (npm test)

*Feature not completely available because of COVID :(
