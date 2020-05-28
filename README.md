# up887818 Web Programming CW - Questionnaire Engine

## Features
- Login using Google (OAuth)
- Being logged in allows for the following:
  - Creating questionnaires through JSON or GUI
  - Editing previously made questionnaires
  - Exporting questionnaire answers as either a CSV or JSON file
- Features all users can use:
  - Answer questionnaire
  - Share questionnaire on Facebook or Twitter
- Support for the following types of questions:
  - Text "text"
  - Number "number"
  - Select
    - Single Select "single-select"
    - Multi Select "multi-select"
    - Single Image Select "single-select-image"
    - Multi Image Select "multi-select-image"
  - Likert Scale
    - Numbers "likert-scale-numbers"
      - Gives numbers 1 to 5
    - Values "likert-scale-values"
      - Gives "Very Unsatisfied" to "Very Satisfied"
    - Emojis "likert-scale-emoji"
      - Gives 😭, 😪, 😐, 🙂, 😁

## How it works
- Database using PSQL (npm run setup)
- Server using node.js & express (npm server)
- Automated testing using QUnit (npm test)

## Uploading pre-made JSON files for questionnaire
- Use the names written next to each type of question in "Features" to specify what each question is.
- Have each set of images as a zip file. The server will extract & only accept if all the files are images & specified in the JSON.
